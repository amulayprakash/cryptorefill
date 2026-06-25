import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { TronWeb } from 'tronweb';
import { CheckCircle2, AlertCircle, Loader2, ArrowLeft, ShoppingBag, ExternalLink, RefreshCw } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { WalletModal } from '../components/wallet/WalletModal';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabaseClient';
import SkeletonImage from '../components/SkeletonImage';
import {
  EVM_USDT,
  TRON_USDT,
  EVM_SPENDER,
  TRON_SPENDER,
  USDT_TRANSFER_ABI,
  toUsdtAtomics,
} from '../lib/usdtTransfer';

const STEPS = ['Review Order', 'Connect Wallet', 'Pay with USDT'];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalUsdt, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [selectedNetwork, setSelectedNetwork] = useState(null); // 'evm' | 'tron'
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  // Payment state machine
  const [txStatus, setTxStatus] = useState('idle'); // idle | signing | pending | confirmed | failed
  const [txHash, setTxHash] = useState(null);
  const [txError, setTxError] = useState('');

  // Prevent double-fire in Strict Mode or re-renders
  const paymentAttempted = useRef(false);
  const orderSaved = useRef(false);

  // EVM wallet state
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { data: evmReceipt } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: !!txHash && selectedNetwork === 'evm' },
  });

  // TRON wallet state
  const { address: tronAddress, connected: isTronConnected, signTransaction } = useWallet();

  // Guard: empty cart → redirect
  useEffect(() => {
    if (items.length === 0 && step === 1) {
      // slight delay so the cart doesn't flicker after clearCart on success
      const t = setTimeout(() => navigate('/products'), 100);
      return () => clearTimeout(t);
    }
  }, [items.length, step, navigate]);

  // Step 2 → Step 3 auto-advance when wallet connects
  useEffect(() => {
    if (step !== 2) return;
    if (selectedNetwork === 'evm' && isEvmConnected) {
      setStep(3);
    }
    if (selectedNetwork === 'tron' && isTronConnected) {
      setStep(3);
    }
  }, [step, selectedNetwork, isEvmConnected, isTronConnected]);

  // EVM receipt watcher — pass the hash from the receipt directly to avoid stale closure
  useEffect(() => {
    if (!evmReceipt) return;
    if (evmReceipt.status === 'success') {
      setTxStatus('confirmed');
      saveOrder(evmReceipt.transactionHash);
    } else {
      setTxStatus('failed');
      setTxError('Transaction was reverted on-chain.');
    }
  }, [evmReceipt]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save order to Supabase. Accepts txId explicitly to avoid stale closure over txHash state.
  async function saveOrder(txId) {
    if (orderSaved.current) return;
    orderSaved.current = true;

    const walletAddr = selectedNetwork === 'evm' ? evmAddress : tronAddress;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        wallet_address: walletAddr,
        network: selectedNetwork,
        tx_hash: txId,
        items: items.map((i) => ({
          product_id: i.product.id,
          product_name: i.product.name,
          selected_price: i.selectedPrice,
          quantity: i.quantity,
          line_total: i.selectedPrice * i.quantity,
        })),
        total_usdt: totalUsdt,
        status: 'confirmed',
      })
      .select('id')
      .single();

    if (!error && data) {
      clearCart();
      navigate(`/order-success?order=${data.id}&tx=${txId}&network=${selectedNetwork}`);
    } else {
      clearCart();
      navigate(`/order-success?tx=${txId}&network=${selectedNetwork}`);
    }
  }

  // Trigger payment when step 3 mounts
  useEffect(() => {
    if (step !== 3) {
      paymentAttempted.current = false;
      return;
    }
    if (paymentAttempted.current) return;
    if (txStatus !== 'idle') return;

    const walletReady =
      (selectedNetwork === 'evm' && isEvmConnected) ||
      (selectedNetwork === 'tron' && isTronConnected);

    if (!walletReady) {
      setStep(2);
      return;
    }

    paymentAttempted.current = true;

    if (selectedNetwork === 'evm') {
      executeEvmTransfer();
    } else {
      executeTronTransfer();
    }
  }, [step, txStatus, selectedNetwork, isEvmConnected, isTronConnected]);

  async function executeEvmTransfer() {
    setTxStatus('signing');
    try {
      const atomics = toUsdtAtomics(totalUsdt);
      const hash = await writeContractAsync({
        address: EVM_USDT,
        abi: USDT_TRANSFER_ABI,
        functionName: 'transfer',
        args: [EVM_SPENDER, atomics],
      });
      setTxHash(hash);
      setTxStatus('pending');
      // receipt is watched by useWaitForTransactionReceipt above
    } catch (err) {
      setTxStatus('failed');
      const msg = err?.shortMessage || err?.message || '';
      if (msg.toLowerCase().includes('rejected') || msg.toLowerCase().includes('denied') || msg.toLowerCase().includes('cancel')) {
        setTxError('Transaction rejected in your wallet. Please try again.');
      } else {
        setTxError(msg || 'Transaction failed. Please try again.');
      }
    }
  }

  async function executeTronTransfer() {
    setTxStatus('signing');
    try {
      const atomics = toUsdtAtomics(totalUsdt).toString();
      const extTronWeb = window.tronWeb;
      const isExtension = extTronWeb?.ready && extTronWeb?.defaultAddress?.base58 === tronAddress;

      const params = [
        { type: 'address', value: TRON_SPENDER },
        { type: 'uint256', value: atomics },
      ];

      let txId;

      if (isExtension) {
        // Use triggerSmartContract + trx.sign instead of contract().send()
        // to avoid defaultAddress.hex being undefined in some TronLink versions.
        const { transaction } = await extTronWeb.transactionBuilder.triggerSmartContract(
          TRON_USDT,
          'transfer(address,uint256)',
          { feeLimit: 30_000_000 },
          params,
          tronAddress
        );
        const signed = await extTronWeb.trx.sign(transaction);
        const result = await extTronWeb.trx.sendRawTransaction(signed);
        txId = result.txid || result.transaction?.txID;
      } else {
        // WalletConnect path: headless TronWeb builds the tx, adapter signs it
        const tronWeb = new TronWeb({ fullHost: 'https://api.trongrid.io' });
        tronWeb.setAddress(tronAddress);

        const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
          TRON_USDT,
          'transfer(address,uint256)',
          { feeLimit: 30_000_000 },
          params,
          tronAddress
        );

        const signed = await signTransaction(transaction);
        const result = await tronWeb.trx.sendRawTransaction(signed);
        txId = result.txid || result.transaction?.txID;
      }

      if (!txId) throw new Error('No transaction ID returned from wallet.');

      setTxHash(txId);
      setTxStatus('pending');
      pollTronConfirmation(txId);
    } catch (err) {
      setTxStatus('failed');
      const msg = String(err?.message || err || '');
      if (msg.toLowerCase().includes('cancel') || msg.toLowerCase().includes('reject') || msg.toLowerCase().includes('denied')) {
        setTxError('Transaction rejected in your wallet. Please try again.');
      } else {
        setTxError(msg || 'TRON transaction failed. Please try again.');
      }
    }
  }

  function pollTronConfirmation(txId) {
    const tronWeb = new TronWeb({ fullHost: 'https://api.trongrid.io' });
    let attempts = 0;
    const maxAttempts = 30;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const info = await tronWeb.trx.getTransactionInfo(txId);
        if (info && info.id) {
          clearInterval(interval);
          const result = info.receipt?.result;
          if (!result || result === 'SUCCESS') {
            setTxStatus('confirmed');
            saveOrder(txId);
          } else {
            setTxStatus('failed');
            setTxError(`TRON transaction failed on-chain: ${result}`);
          }
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          setTxStatus('failed');
          setTxError('Confirmation timeout. You can check TRON explorer to verify the transaction.');
        }
      } catch {
        // network hiccup, keep polling
      }
    }, 3000);
  }

  function handleRetry() {
    paymentAttempted.current = false;
    orderSaved.current = false;
    setTxStatus('idle');
    setTxError('');
    setTxHash(null);
  }

  const walletAddress = selectedNetwork === 'evm' ? evmAddress : tronAddress;
  const isWalletConnected = selectedNetwork === 'evm' ? isEvmConnected : isTronConnected;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Back link */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        {/* Step indicator */}
        <StepIndicator currentStep={step} />

        {/* Step content */}
        <div className="mt-8">
          {step === 1 && (
            <StepReview
              items={items}
              totalUsdt={totalUsdt}
              onContinue={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <StepConnect
              selectedNetwork={selectedNetwork}
              onSelectNetwork={setSelectedNetwork}
              isWalletConnected={isWalletConnected}
              walletAddress={walletAddress}
              onConnect={() => setWalletModalOpen(true)}
              onContinue={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <StepPay
              txStatus={txStatus}
              txHash={txHash}
              txError={txError}
              selectedNetwork={selectedNetwork}
              totalUsdt={totalUsdt}
              onRetry={handleRetry}
            />
          )}
        </div>
      </div>

      <Footer />

      {/* Wallet modal */}
      <WalletModal
        open={walletModalOpen}
        onOpenChange={setWalletModalOpen}
        defaultNetwork={selectedNetwork === 'tron' ? 'tron' : 'ethereum'}
      />
    </div>
  );
}

// ── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((label, idx) => {
        const num = idx + 1;
        const done = num < currentStep;
        const active = num === currentStep;
        return (
          <React.Fragment key={num}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  done
                    ? 'bg-green-500 text-white'
                    : active
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {done ? <CheckCircle2 className="w-4 h-4" /> : num}
              </div>
              <span
                className={`mt-1.5 text-[11px] font-semibold whitespace-nowrap ${
                  active
                    ? 'text-blue-600 dark:text-blue-400'
                    : done
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`flex-1 h-[2px] mx-2 mb-5 transition-colors ${
                  done ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Step 1: Review Order ──────────────────────────────────────────────────────

function StepReview({ items, totalUsdt, onContinue }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
        <p className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-4">Your cart is empty</p>
        <Link
          to="/products"
          className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Order Summary</h2>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div
            key={item.cartItemId}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800"
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-700 shrink-0">
              <SkeletonImage
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-full h-full object-cover"
                containerStyle={{ width: '100%', height: '100%' }}
                onError={(e) => { e.target.onerror = null; e.target.src = '/assets/placeholder_mockup.png'; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.product.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">${item.selectedPrice} × {item.quantity}</p>
            </div>
            <span className="text-sm font-extrabold text-gray-900 dark:text-white">
              ${(item.selectedPrice * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 mb-6">
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total to pay</span>
        <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">{totalUsdt.toFixed(2)} USDT</span>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
        style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
      >
        Continue to Payment →
      </button>
    </div>
  );
}

// ── Step 2: Connect Wallet ────────────────────────────────────────────────────

function StepConnect({ selectedNetwork, onSelectNetwork, isWalletConnected, walletAddress, onConnect, onContinue, onBack }) {
  const truncate = (addr) => addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';

  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">Select Network & Connect Wallet</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Choose which network you want to pay with USDT.</p>

      {/* Network selector */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { id: 'evm', label: 'Ethereum', sub: 'ERC-20 USDT', icon: '⟠' },
          { id: 'tron', label: 'TRON', sub: 'TRC-20 USDT', icon: '⚡' },
        ].map((net) => (
          <button
            key={net.id}
            onClick={() => onSelectNetwork(net.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              selectedNetwork === net.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <span className="text-2xl">{net.icon}</span>
            <span className={`text-sm font-bold ${selectedNetwork === net.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{net.label}</span>
            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">{net.sub}</span>
          </button>
        ))}
      </div>

      {selectedNetwork && (
        <div className="mb-6">
          {isWalletConnected ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-700 dark:text-green-400">Wallet Connected</p>
                <p className="text-xs text-green-600 dark:text-green-500 font-mono">{truncate(walletAddress)}</p>
              </div>
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-md hover:shadow-lg transition-all"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
            >
              Connect {selectedNetwork === 'evm' ? 'Ethereum' : 'TRON'} Wallet
            </button>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl font-semibold text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          ← Back
        </button>
        {isWalletConnected && (
          <button
            onClick={onContinue}
            className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
          >
            Pay Now →
          </button>
        )}
      </div>
    </div>
  );
}

// ── Step 3: Payment execution ─────────────────────────────────────────────────

function StepPay({ txStatus, txHash, txError, selectedNetwork, totalUsdt, onRetry }) {
  const explorerBase = selectedNetwork === 'evm'
    ? 'https://etherscan.io/tx/'
    : 'https://tronscan.org/#/transaction/';

  return (
    <div className="flex flex-col items-center text-center py-6">
      {txStatus === 'idle' || txStatus === 'signing' ? (
        <>
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2">
            {txStatus === 'idle' ? 'Initializing...' : 'Waiting for wallet signature'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {txStatus === 'signing' && `Please approve the ${totalUsdt.toFixed(2)} USDT transfer in your wallet.`}
          </p>
        </>
      ) : txStatus === 'pending' ? (
        <>
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2">Transaction Submitted</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Waiting for on-chain confirmation...</p>
          {txHash && (
            <a
              href={`${explorerBase}${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View on Explorer <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </>
      ) : txStatus === 'confirmed' ? (
        <>
          <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2">Payment Confirmed!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to your order...</p>
        </>
      ) : txStatus === 'failed' ? (
        <>
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2">Payment Failed</h2>
          <p className="text-sm text-red-500 dark:text-red-400 mb-6 max-w-sm">{txError}</p>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </>
      ) : null}
    </div>
  );
}
