import { createContext, useContext, useState, useCallback } from 'react';
import { TronWalletConnectQRModal } from '../components/wallet/TronWalletConnectQRModal';

const TronWalletConnectQRContext = createContext(null);

export function useTronWalletConnectQRContext() {
  const ctx = useContext(TronWalletConnectQRContext);
  if (!ctx) {
    return {
      onDisplayUri: () => {},
      onCloseModal: () => {},
    };
  }
  return ctx;
}

export function TronWalletConnectQRProvider({ children }) {
  const [uri, setUri] = useState(null);
  const [open, setOpen] = useState(false);

  const onDisplayUri = useCallback((u) => {
    setUri(u);
    setOpen(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setOpen(false);
    setUri(null);
  }, []);

  const value = { onDisplayUri, onCloseModal };

  return (
    <TronWalletConnectQRContext.Provider value={value}>
      {children}
      <TronWalletConnectQRModal open={open} uri={uri} onClose={onCloseModal} />
    </TronWalletConnectQRContext.Provider>
  );
}
