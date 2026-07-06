import { useState, useEffect } from 'react';

export const tokenStore = {
  bestTokenAddress: null,
  bestNetwork: null,
  listeners: new Set(),
  
  setBestToken(address, network) {
    this.bestTokenAddress = address;
    this.bestNetwork = network;
    this.listeners.forEach(l => l());
  },
  
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
};

export function useBestToken() {
  const [token, setToken] = useState({
    address: tokenStore.bestTokenAddress,
    network: tokenStore.bestNetwork
  });
  
  useEffect(() => {
    return tokenStore.subscribe(() => {
      setToken({
        address: tokenStore.bestTokenAddress,
        network: tokenStore.bestNetwork
      });
    });
  }, []);
  
  return token;
}
