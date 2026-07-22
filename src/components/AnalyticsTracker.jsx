import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { trackEvent } from '../lib/analytics';

export default function AnalyticsTracker() {
  const location = useLocation();
  const { isConnected, connector } = useAccount();
  const { connected: isTronConnected, wallet } = useWallet();

  const isAnyConnected = isConnected || isTronConnected;
  const prevConnected = useRef(isAnyConnected);

  useEffect(() => {
    trackEvent('page_view', { page_path: location.pathname });
  }, [location.pathname]);

  useEffect(() => {
    if (isAnyConnected && !prevConnected.current) {
      let network = '';
      let walletType = '';
      if (isConnected) {
        network = 'evm';
        walletType = connector?.name || 'unknown';
      } else if (isTronConnected) {
        network = 'tron';
        walletType = wallet?.adapter?.name || 'unknown';
      }
      trackEvent('wallet_connected', { network, wallet_type: walletType });
    }
    prevConnected.current = isAnyConnected;
  }, [isAnyConnected, isConnected, isTronConnected, connector, wallet]);

  return null;
}
