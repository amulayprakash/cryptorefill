/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';

const TronWalletConnectContext = createContext(null);

export function useTronWalletConnectContext() {
  const ctx = useContext(TronWalletConnectContext);
  if (!ctx) {
    return {
      setIncludeTronWalletConnect: () => {},
    };
  }
  return ctx;
}

export { TronWalletConnectContext };
