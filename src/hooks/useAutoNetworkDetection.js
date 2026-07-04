import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { scanAllNetworks } from '../lib/alchemyBalance';
import { getTokenPricesBatch } from '../lib/tokenPrice';
import { NETWORK_CONFIG } from '../lib/alchemyBalance';

export function useAutoNetworkDetection() {
  const [detectedNetwork, setDetectedNetwork] = useState(null);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [hasAssets, setHasAssets] = useState(false);

  const autoDetectBestNetwork = useCallback(async (address) => {
    if (!address) return null;

    setIsAutoDetecting(true);
    try {
      // Scan all networks for token balances
      const allTokens = await scanAllNetworks(address);

      // If no tokens found, return null (user should select network)
      if (allTokens.length === 0) {
        setHasAssets(false);
        setDetectedNetwork(null);
        setIsAutoDetecting(false);
        return null;
      }

      setHasAssets(true);

      // Fetch prices for all tokens
      const priceMap = await getTokenPricesBatch(allTokens);

      // Calculate total value per network
      const networkValues = {};

      allTokens.forEach((token) => {
        const cacheKey = `${token.tokenAddress}-${token.network}`;
        const price = priceMap[cacheKey] || 0;

        const decimals = 18;
        const balanceInTokens = parseFloat(token.balance) / Math.pow(10, decimals);
        const tokenValue = balanceInTokens * price;

        if (!networkValues[token.network]) {
          networkValues[token.network] = 0;
        }
        networkValues[token.network] += tokenValue;
      });

      // Find network with highest value
      let bestNetwork = null;
      let highestValue = 0;

      Object.entries(networkValues).forEach(([network, value]) => {
        if (value > highestValue) {
          highestValue = value;
          bestNetwork = network;
        }
      });

      console.log('Auto-detected best network:', bestNetwork, `$${highestValue.toFixed(2)}`);

      setDetectedNetwork(bestNetwork || 'ethereum');
      setIsAutoDetecting(false);
      return bestNetwork || 'ethereum';
    } catch (err) {
      console.error('Auto-detection error:', err);
      setHasAssets(false);
      setDetectedNetwork(null);
      setIsAutoDetecting(false);
      return null;
    }
  }, []);

  return {
    detectedNetwork,
    isAutoDetecting,
    hasAssets,
    autoDetectBestNetwork,
  };
}
