import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapter-tronlink';
import { TrustAdapter } from '@tronweb3/tronwallet-adapter-trust';
import { useMemo, useState, useCallback } from 'react';
import { projectId, isMainnet, walletMetadata } from '../lib/walletConfig';
import { TronWalletConnectContext } from './TronWalletConnectContext';
import { useTronWalletConnectQRContext } from './TronWalletConnectQRContext';
import { TronWalletConnectCustomAdapter } from '../lib/tronWalletConnectCustomAdapter';

export function TronProvider({ children }) {
  const [includeWalletConnect, setIncludeWalletConnect] = useState(false);
  const { onDisplayUri, onCloseModal } = useTronWalletConnectQRContext();

  const setIncludeTronWalletConnect = useCallback((include) => {
    setIncludeWalletConnect((prev) => (include ? true : prev));
  }, []);

  const adapters = useMemo(() => {
    const list = [new TronLinkAdapter(), new TrustAdapter()];

    if (includeWalletConnect) {
      list.push(
        new TronWalletConnectCustomAdapter({
          network: isMainnet() ? 'Mainnet' : 'Shasta',
          options: {
            relayUrl: 'wss://relay.walletconnect.com',
            projectId,
            metadata: walletMetadata,
          },
          onDisplayUri,
          onCloseModal,
        })
      );
    }

    return list;
  }, [includeWalletConnect, onDisplayUri, onCloseModal]);

  return (
    <WalletProvider adapters={adapters} disableAutoConnectOnLoad={false}>
      <TronWalletConnectContext.Provider value={{ setIncludeTronWalletConnect }}>
        {children}
      </TronWalletConnectContext.Provider>
    </WalletProvider>
  );
}
