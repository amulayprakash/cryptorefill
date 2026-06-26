import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Wallet,
  Smartphone,
  Globe,
  ChevronRight,
  Loader2,
  Copy,
  Check,
  LogOut,
} from 'lucide-react';
import {
  useConnect,
  useChainId,
  useSwitchChain,
  useAccount,
  useDisconnect,
} from 'wagmi';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import {
  getActiveChain,
  getNetworkName,
  isMobileDevice,
  isInWalletBrowser,
} from '../../lib/walletConfig';
import { useTronWalletConnectContext } from '../../providers/TronWalletConnectContext';
import { cn } from '../../lib/cn';
import { Dialog } from './Dialog';
import { NetworkSelector } from './NetworkSelector';

const truncate = (addr) =>
  addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';

// Resolve once the official WalletConnect (@walletconnect/modal) overlay is
// actually rendered on screen. Its `<wcm-modal>` element lives in document.body
// but only renders the `.wcm-card` in its shadow DOM when its internal `open`
// state is true (see @walletconnect/modal-ui) — i.e. when it's visible to the
// user. We poll for that so we can hand off from our own modal without a blank
// flash. Falls back after `timeout` ms so we never hang if it fails to open.
function waitForWalletConnectModal(timeout = 6000) {
  return new Promise((resolve) => {
    const isShown = () => {
      const modal = document.querySelector('wcm-modal');
      return !!modal?.shadowRoot?.querySelector('.wcm-card');
    };
    if (isShown()) {
      resolve();
      return;
    }
    const start = Date.now();
    const interval = setInterval(() => {
      if (isShown() || Date.now() - start >= timeout) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}

const getWalletStyle = (name) => {
  const n = name.toLowerCase();
  if (n.includes('walletconnect'))
    return { icon: Smartphone, color: 'text-[#3b99fc]', bg: 'bg-[#3b99fc]/10', border: 'group-hover:border-[#3b99fc]/50' };
  if (n.includes('metamask'))
    return { icon: Globe, color: 'text-[#f6851b]', bg: 'bg-[#f6851b]/10', border: 'group-hover:border-[#f6851b]/50' };
  if (n.includes('injected'))
    return { icon: Globe, color: 'text-blue-600', bg: 'bg-blue-600/10', border: 'group-hover:border-blue-600/50' };
  return { icon: Wallet, color: 'text-gray-500 dark:text-white', bg: 'bg-gray-500/10 dark:bg-white/10', border: 'group-hover:border-gray-400/50' };
};

export function WalletModal({ open, onOpenChange, defaultNetwork = null }) {
  const [selectedNetwork, setSelectedNetwork] = useState(defaultNetwork);
  const [connectingId, setConnectingId] = useState(null);
  const [isWaitingForWalletConnect, setIsWaitingForWalletConnect] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  // TRON connect is two-phase: select the adapter, then connect once the
  // selection has committed to state (avoids WalletNotSelectedError).
  const [pendingTronConnect, setPendingTronConnect] = useState(null);
  const tronConnectStarted = useRef(false);

  const { connectors, connectAsync, isPending } = useConnect();
  const { address, isConnected, status: wagmiStatus } = useAccount();
  const { disconnectAsync: disconnectEvmWallet } = useDisconnect();

  // TRON adapter hooks
  const {
    wallets: tronWallets,
    select: selectTronWallet,
    connect: connectTronWallet,
    disconnect: disconnectTronWallet,
    connected: isTronConnected,
    address: tronAddress,
    wallet: currentTronWallet,
  } = useWallet();

  const { setIncludeTronWalletConnect } = useTronWalletConnectContext();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();

  const [isMobile, setIsMobile] = useState(false);
  const [hasInjectedWallet, setHasInjectedWallet] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(isMobileDevice());
    setHasInjectedWallet(isInWalletBrowser());
  }, []);

  // Filter and sort connectors for better mobile UX (ported from casino-ui)
  const filteredConnectors = useMemo(() => {
    const result = [];
    const seen = new Set();

    for (const connector of connectors) {
      const name = connector.name.toLowerCase();
      const id = connector.id.toLowerCase();

      const key = `${name}-${id}`;
      if (seen.has(key)) continue;
      seen.add(key);

      // TronLink (and other TRON-only wallets) announce an EIP-6963 provider,
      // so wagmi discovers them here — but they belong on the TRON tab, not the
      // Ethereum list. Drop anything that identifies as a TRON wallet.
      if (name.includes('tron') || id.includes('tron')) continue;

      // On mobile without an in-app wallet browser, the plain "Injected"
      // connector won't work (no extension) — drop it. WalletConnect always
      // stays so there is always a mobile-wallet option.
      if (isMobile && !hasInjectedWallet) {
        if (name === 'injected' || id === 'injected') continue;
      }

      result.push(connector);
    }

    return result.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName.includes('metamask')) return -1;
      if (bName.includes('metamask')) return 1;
      if (aName.includes('injected')) return -1;
      if (bName.includes('injected')) return 1;
      if (aName.includes('walletconnect')) return 1;
      if (bName.includes('walletconnect')) return -1;
      return 0;
    });
  }, [connectors, isMobile, hasInjectedWallet]);

  const isAnyConnected = isConnected || isTronConnected;
  const activeChain = getActiveChain();
  const isWrongNetwork = isConnected && chainId !== activeChain.id;
  const activeAddress = isConnected ? address : isTronConnected ? tronAddress : null;
  const activeNetworkLabel = isConnected ? 'Ethereum' : isTronConnected ? 'TRON' : '';

  // Sync selectedNetwork when defaultNetwork / open changes
  useEffect(() => {
    if (open && defaultNetwork) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedNetwork(defaultNetwork);
      if (defaultNetwork === 'tron') setIncludeTronWalletConnect(true);
    }
  }, [open, defaultNetwork, setIncludeTronWalletConnect]);

  // Clear connecting state once a connection succeeds
  useEffect(() => {
    if ((isConnected || isTronConnected) && connectingId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConnectingId(null);
      setIsWaitingForWalletConnect(false);
    }
  }, [isConnected, isTronConnected, connectingId]);

  useEffect(() => {
    if (wagmiStatus === 'connected' && isWaitingForWalletConnect) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsWaitingForWalletConnect(false);
      setConnectingId(null);
    }
  }, [wagmiStatus, isWaitingForWalletConnect]);

  // Once the requested TRON adapter is actually selected, connect to it.
  useEffect(() => {
    if (!pendingTronConnect) {
      tronConnectStarted.current = false;
      return;
    }
    if (currentTronWallet?.adapter.name !== pendingTronConnect) return;
    if (tronConnectStarted.current) return;
    tronConnectStarted.current = true;

    (async () => {
      try {
        await connectTronWallet();
      } catch (e) {
        console.error('[WalletModal] TRON connect failed:', pendingTronConnect, e);
        const msg = e?.message || '';
        if (msg.includes('rejected') || msg.includes('denied'))
          setErrorMsg('Connection was cancelled.');
        else if (msg.includes('expired'))
          setErrorMsg('Connection request expired. Please try again.');
        else if (msg.includes('timeout') || msg.includes('Timeout'))
          setErrorMsg('Connection timed out. Please try again.');
        else setErrorMsg(e?.message || 'Connection failed. Please try again.');
      } finally {
        setPendingTronConnect(null);
        setConnectingId(null);
        setIsWaitingForWalletConnect(false);
      }
    })();
  }, [pendingTronConnect, currentTronWallet, connectTronWallet]);

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      setSelectedNetwork(defaultNetwork);
      setConnectingId(null);
      setIsWaitingForWalletConnect(false);
      setErrorMsg('');
      setPendingTronConnect(null);
    }
    onOpenChange(newOpen);
  };

  const handleCopy = useCallback(() => {
    if (activeAddress) {
      navigator.clipboard.writeText(activeAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [activeAddress]);

  const handleDisconnect = async () => {
    try {
      if (isConnected) await disconnectEvmWallet();
      if (isTronConnected) await disconnectTronWallet();
    } catch (_) {
      // ignore
    }
    setSelectedNetwork(defaultNetwork);
  };

  const headerTitle = isAnyConnected
    ? 'Wallet Connected'
    : selectedNetwork
    ? 'Select Wallet'
    : 'Connect Wallet';

  let headerSubtitle = '';
  if (!isAnyConnected && !selectedNetwork) headerSubtitle = 'Choose your blockchain network';
  else if (!isAnyConnected && selectedNetwork)
    headerSubtitle = selectedNetwork === 'ethereum' ? 'Ethereum wallets' : 'TRON wallets';

  const renderBody = () => {
    // Connected: wrong network warning
    if (isAnyConnected && isWrongNetwork) {
      return (
        <div className="p-6 pt-2 flex flex-col items-center justify-center gap-6 min-h-[260px]">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center animate-pulse">
            <Globe className="w-8 h-8 text-orange-500" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold">Wrong Network</h3>
            <p className="text-sm text-gray-500 dark:text-white/60 max-w-[260px]">
              Please switch to the {getNetworkName()} network to continue.
            </p>
          </div>
          <button
            type="button"
            onClick={() => switchChain({ chainId: activeChain.id })}
            disabled={isSwitchingChain}
            className="w-full max-w-[200px] flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 disabled:opacity-50"
          >
            {isSwitchingChain ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Switching...
              </>
            ) : (
              `Switch to ${getNetworkName()}`
            )}
          </button>
        </div>
      );
    }

    // Connected: show address + disconnect
    if (isAnyConnected) {
      return (
        <div className="p-6 pt-2 flex flex-col items-center gap-5">
          <div className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#111316] p-4 flex flex-col items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-white/40 font-semibold">
              {activeNetworkLabel} Wallet
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="group flex items-center gap-2 text-base font-mono font-semibold text-gray-900 dark:text-white"
              title="Copy address"
            >
              {truncate(activeAddress)}
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white" />
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={handleDisconnect}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 font-semibold py-2.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      );
    }

    // Not connected: network selection
    if (!selectedNetwork) {
      return (
        <div className="p-6 pt-2">
          <NetworkSelector
            value={selectedNetwork}
            onChange={(network) => {
              setSelectedNetwork(network);
              if (network === 'tron') setIncludeTronWalletConnect(true);
            }}
          />
        </div>
      );
    }

    // Not connected: EVM connectors
    if (selectedNetwork === 'ethereum') {
      return (
        <div className="p-6 pt-2 space-y-6">
          <div className="flex flex-col gap-3">
            {filteredConnectors.map((connector) => {
              const { icon: Icon, color, bg, border } = getWalletStyle(connector.name);
              const connectorName = connector.name.toLowerCase();
              const isWalletConnect = connectorName.includes('walletconnect');
              const isConnecting = connectingId === connector.uid || (isPending && connectingId === connector.uid);
              const showLoading = isConnecting || (isWalletConnect && isWaitingForWalletConnect);

              let subtitle = 'Browser extension';
              if (isWalletConnect) {
                subtitle = isMobile ? 'Tap to open wallet app' : 'Choose from 400+ wallets';
              } else if (connectorName.includes('metamask')) {
                subtitle = isMobile && !hasInjectedWallet ? 'Tap to open MetaMask app' : 'Browser extension';
              }
              const displaySubtitle = showLoading
                ? isWalletConnect
                  ? 'Scan QR code in wallet...'
                  : 'Connecting...'
                : subtitle;

              return (
                <button
                  key={connector.uid}
                  disabled={showLoading || isWaitingForWalletConnect}
                  onClick={async () => {
                    setErrorMsg('');
                    // WalletConnect: the official @walletconnect/modal
                    // (showQrModal:true) opens its own full-screen overlay with
                    // the searchable wallet list + QR. The overlay opens
                    // asynchronously, so we keep OUR modal open (in a loading
                    // state) until it's actually rendered on screen, then hand
                    // off — otherwise there's a blank gap where neither modal is
                    // visible. The WC modal then surfaces its own connection
                    // state/errors.
                    if (isWalletConnect) {
                      setConnectingId(connector.uid);
                      setIsWaitingForWalletConnect(true);
                      // Kick off the connection (this triggers the WC overlay to
                      // open); don't await it here — it only resolves once the
                      // whole connection completes.
                      const connectPromise = connectAsync({ connector }).catch((err) => {
                        console.error('[WalletModal] WalletConnect failed:', err);
                      });
                      // Hold our modal open until the WC overlay is on screen.
                      // Smooth-scroll (Lenis) is told to ignore the WC modal's
                      // elements via the `prevent` option in App.jsx, so its
                      // wallet list scrolls natively.
                      await waitForWalletConnectModal();
                      handleOpenChange(false);
                      await connectPromise;
                      return;
                    }

                    setConnectingId(connector.uid);
                    // Injected/MetaMask connect straight to the extension.
                    try {
                      await connectAsync({ connector });
                    } catch (err) {
                      console.error('[WalletModal] EVM connect failed:', connector.name, err);
                      const m = (err?.shortMessage || err?.message || '').toLowerCase();
                      if (err?.name === 'UserRejectedRequestError' || m.includes('rejected') || m.includes('denied')) {
                        setErrorMsg('Request rejected in your wallet.');
                      } else if (m.includes('already') || m.includes('pending')) {
                        setErrorMsg('A request is already pending — open your wallet.');
                      } else if (m.includes('provider') || m.includes('not found') || m.includes('not detected')) {
                        setErrorMsg('Wallet not detected. Is the extension installed & unlocked?');
                      } else {
                        setErrorMsg(err?.shortMessage || err?.message || 'Connection failed. Please try again.');
                      }
                    } finally {
                      setConnectingId(null);
                    }
                  }}
                  className={cn(
                    'group relative flex items-center w-full p-3.5 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-[#111316] hover:bg-gray-50 dark:hover:bg-[#16181b] transition-all duration-300 outline-none focus:ring-2 focus:ring-blue-500/40',
                    border,
                    showLoading && 'opacity-70 cursor-wait'
                  )}
                >
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-transform group-hover:scale-105', bg)}>
                    {showLoading ? (
                      <Loader2 className={cn('w-5 h-5 animate-spin', color)} />
                    ) : (
                      <Icon className={cn('w-5 h-5', color)} />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <span className="block font-medium text-sm text-gray-900 dark:text-white">{connector.name}</span>
                    <span className="text-[11px] text-gray-400 dark:text-white/50 tracking-tight">{displaySubtitle}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 dark:text-white/10 group-hover:text-gray-500 dark:group-hover:text-white/40 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}

            {filteredConnectors.length === 0 && (
              <div className="text-center p-4 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs border border-amber-500/20">
                {isMobile
                  ? "No wallets available. Please open this site in your wallet's browser or use WalletConnect."
                  : 'No wallets found. Please install MetaMask or another wallet extension.'}
              </div>
            )}
          </div>

          {errorMsg && <p className="text-xs text-red-500 text-center">{errorMsg}</p>}

          <div className="pt-2 text-center border-t border-gray-100 dark:border-white/5">
            <p className="text-[10px] text-gray-400 dark:text-white/40 uppercase tracking-widest font-medium">Secured by Wagmi</p>
          </div>
        </div>
      );
    }

    // Not connected: TRON wallets
    if (selectedNetwork === 'tron') {
      return (
        <div className="p-6 pt-2 space-y-6">
          <div className="flex flex-col gap-3">
            {tronWallets.map((w) => {
              const isWalletConnect = w.adapter.name === 'WalletConnect';
              const { icon: Icon, color, bg, border } = getWalletStyle(isWalletConnect ? 'WalletConnect' : w.adapter.name);
              const isConnecting = connectingId === w.adapter.name;
              const showLoading = isConnecting || (isWalletConnect && isWaitingForWalletConnect);

              return (
                <button
                  key={w.adapter.name}
                  disabled={showLoading || isWaitingForWalletConnect}
                  onClick={() => {
                    setErrorMsg('');
                    setConnectingId(w.adapter.name);
                    if (isWalletConnect) setIsWaitingForWalletConnect(true);
                    // Select the adapter if needed; the pendingTronConnect
                    // effect performs the actual connect once it is selected.
                    if (w.adapter.name !== currentTronWallet?.adapter.name) {
                      selectTronWallet(w.adapter.name);
                    }
                    setPendingTronConnect(w.adapter.name);
                  }}
                  className={cn(
                    'group relative flex items-center w-full p-3.5 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-[#111316] hover:bg-gray-50 dark:hover:bg-[#16181b] transition-all duration-300 outline-none focus:ring-2 focus:ring-blue-500/40',
                    border,
                    showLoading && 'opacity-70 cursor-wait'
                  )}
                >
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-transform group-hover:scale-105', bg)}>
                    {showLoading ? (
                      <Loader2 className={cn('w-5 h-5 animate-spin', color)} />
                    ) : w.adapter.icon ? (
                      <img src={w.adapter.icon} alt={w.adapter.name} className="w-5 h-5 object-contain" />
                    ) : (
                      <Icon className={cn('w-5 h-5', color)} />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <span className="block font-medium text-sm text-gray-900 dark:text-white">
                      {isWalletConnect ? 'Mobile Wallets' : w.adapter.name}
                    </span>
                    <span className="text-[11px] text-gray-400 dark:text-white/50 tracking-tight">
                      {showLoading
                        ? isWalletConnect
                          ? 'Scan QR code in wallet...'
                          : 'Connecting...'
                        : isWalletConnect
                        ? 'Scan with Trust Wallet / TronLink'
                        : 'Browser Extension'}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 dark:text-white/10 group-hover:text-gray-500 dark:group-hover:text-white/40 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}
          </div>

          {errorMsg && <p className="text-xs text-red-500 text-center">{errorMsg}</p>}
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      preventClose={!!connectingId}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg transition-all duration-300',
              isAnyConnected
                ? 'bg-blue-600/15 border-blue-600/30 text-blue-600'
                : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/70'
            )}
          >
            <Wallet className="w-7 h-7" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{headerTitle}</h2>
            {headerSubtitle && (
              <p className="text-sm font-normal text-gray-500 dark:text-white/50">{headerSubtitle}</p>
            )}
          </div>
        </div>
      </div>

      {renderBody()}
    </Dialog>
  );
}
