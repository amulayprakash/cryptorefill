import { useState, useCallback, useRef } from 'react';
import { useSwitchChain } from 'wagmi';
import { scanAllNetworks } from '../lib/alchemyBalance';
import { getTokenPricesBatch } from '../lib/tokenPrice';
import { NETWORK_CONFIG } from '../lib/alchemyBalance';

export function useSmartNetworkDetection() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setError] = useState(null);
  const { switchChain } = useSwitchChain();
  const scanInProgressRef = useRef(false);

  const detectBestNetwork = useCallback(
    async (address) => {
      // Prevent multiple concurrent scans
      if (scanInProgressRef.current) {
        console.log('Scan already in progress, skipping...');
        return null;
      }

      scanInProgressRef.current = true;
      setIsScanning(true);
      setError(null);

      try {
        // Scan all networks for token balances
        const allTokens = await scanAllNetworks(address);

        if (allTokens.length === 0) {
          console.log('No tokens found on any network');
          setIsScanning(false);
          scanInProgressRef.current = false;
          return null;
        }

        // Fetch prices for all tokens
        const priceMap = await getTokenPricesBatch(allTokens);

        // Calculate total value per network
        const networkValues = {};

        allTokens.forEach((token) => {
          const cacheKey = `${token.tokenAddress}-${token.network}`;
          const price = priceMap[cacheKey] || 0;

          // Most ERC20 tokens use 18 decimals, but we use that as safe default
          // In production, fetch actual decimals from token metadata for accuracy
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

        const result = {
          bestNetwork,
          highestValue,
          networkValues,
          tokensByNetwork: allTokens.reduce((acc, token) => {
            if (!acc[token.network]) acc[token.network] = [];
            acc[token.network].push(token);
            return acc;
          }, {}),
        };

        setIsScanning(false);
        scanInProgressRef.current = false;
        return result;
      } catch (err) {
        console.error('Network detection error:', err);
        setError(err.message);
        setIsScanning(false);
        scanInProgressRef.current = false;
        return null;
      }
    },
    [switchChain]
  );

  const switchToBestNetwork = useCallback(
    async (address) => {
      try {
        const result = await detectBestNetwork(address);

        if (!result || !result.bestNetwork) {
          console.log('Could not determine best network');
          return null;
        }

        const { bestNetwork, highestValue, networkValues } = result;
        const bestNetworkConfig = NETWORK_CONFIG[bestNetwork];

        console.log('Network detection results:', {
          bestNetwork,
          highestValue: `$${highestValue.toFixed(2)}`,
          allNetworks: Object.entries(networkValues).map(([net, val]) => ({
            network: net,
            value: `$${val.toFixed(2)}`,
          })),
        });

        if (bestNetworkConfig && highestValue > 0) {
          // Switch to best network
          try {
            await switchChain({ chainId: bestNetworkConfig.chainId });
            console.log(`Switched to ${bestNetwork}`);
          } catch (switchErr) {
            console.error(`Failed to switch to ${bestNetwork}:`, switchErr);
            // Don't throw - network detection succeeded even if switch failed
          }
        }

        return result;
      } catch (err) {
        console.error('Smart network detection failed:', err);
        setError(err.message);
        return null;
      }
    },
    [detectBestNetwork, switchChain]
  );

  return {
    isScanning,
    scanError,
    detectBestNetwork,
    switchToBestNetwork,
  };
}
