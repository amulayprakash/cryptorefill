// Cache for token prices to reduce API calls
const priceCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getTokenPrice(tokenAddress, network = 'ethereum') {
  const cacheKey = `${tokenAddress}-${network}`;
  const cached = priceCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.price;
  }

  try {
    // Map network to CoinGecko platform ID
    const platformMap = {
      ethereum: 'ethereum',
      polygon: 'polygon-pos',
      arbitrum: 'arbitrum-one',
      optimism: 'optimistic-ethereum',
      base: 'base',
      linea: 'linea',
      scroll: 'scroll',
      blast: 'blast',
      zksync: 'zksync',
      mantle: 'mantle',
      gnosis: 'xdai',
    };

    const platform = platformMap[network] || 'ethereum';

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/${platform}?contract_addresses=${tokenAddress}&vs_currencies=usd`
    );

    const data = await response.json();
    const price = data[tokenAddress.toLowerCase()]?.usd || 0;

    // Cache the price
    priceCache.set(cacheKey, {
      price,
      timestamp: Date.now(),
    });

    return price;
  } catch (error) {
    console.error(`Failed to fetch price for ${tokenAddress}:`, error);
    return 0;
  }
}

export async function getTokenPricesBatch(tokens) {
  // Group tokens by network
  const tokensByNetwork = {};
  tokens.forEach((token) => {
    if (!tokensByNetwork[token.network]) {
      tokensByNetwork[token.network] = [];
    }
    tokensByNetwork[token.network].push(token.tokenAddress);
  });

  // Fetch prices for each network in parallel
  const results = {};
  await Promise.all(
    Object.entries(tokensByNetwork).map(async ([network, addresses]) => {
      const platformMap = {
        ethereum: 'ethereum',
        polygon: 'polygon-pos',
        arbitrum: 'arbitrum-one',
        optimism: 'optimistic-ethereum',
        base: 'base',
        linea: 'linea',
        scroll: 'scroll',
        blast: 'blast',
        zksync: 'zksync',
        mantle: 'mantle',
        gnosis: 'xdai',
      };

      const platform = platformMap[network] || 'ethereum';
      const contractAddresses = addresses.join(',');

      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/token_price/${platform}?contract_addresses=${contractAddresses}&vs_currencies=usd`
        );

        const data = await response.json();

        addresses.forEach((address) => {
          const cacheKey = `${address}-${network}`;
          const price = data[address.toLowerCase()]?.usd || 0;

          priceCache.set(cacheKey, {
            price,
            timestamp: Date.now(),
          });

          results[cacheKey] = price;
        });
      } catch (error) {
        console.error(`Failed to fetch prices for network ${network}:`, error);
        addresses.forEach((address) => {
          results[`${address}-${network}`] = 0;
        });
      }
    })
  );

  return results;
}

export function clearPriceCache() {
  priceCache.clear();
}
