const ALCHEMY_API_KEY = import.meta.env.VITE_MAINNET_RPC_URL?.split('/').pop() || '4UA7f8bHykMEEFhQrzD5ywYgN3y9bxJB';

const NETWORK_CONFIG = {
  ethereum: {
    name: 'Ethereum',
    chainId: 1,
    alchemyNetwork: 'eth-mainnet',
    apiKey: ALCHEMY_API_KEY,
  },
  polygon: {
    name: 'Polygon',
    chainId: 137,
    alchemyNetwork: 'polygon-mainnet',
    apiKey: ALCHEMY_API_KEY,
  },
  arbitrum: {
    name: 'Arbitrum',
    chainId: 42161,
    alchemyNetwork: 'arb-mainnet',
    apiKey: ALCHEMY_API_KEY,
  },
  optimism: {
    name: 'Optimism',
    chainId: 10,
    alchemyNetwork: 'opt-mainnet',
    apiKey: ALCHEMY_API_KEY,
  },
  base: {
    name: 'Base',
    chainId: 8453,
    alchemyNetwork: 'base-mainnet',
    apiKey: ALCHEMY_API_KEY,
  },
  linea: {
    name: 'Linea',
    chainId: 59144,
    alchemyNetwork: 'linea-mainnet',
    apiKey: ALCHEMY_API_KEY,
  },
  scroll: {
    name: 'Scroll',
    chainId: 534352,
    alchemyNetwork: 'scroll-mainnet',
    apiKey: ALCHEMY_API_KEY,
  },
  blast: {
    name: 'Blast',
    chainId: 81457,
    alchemyNetwork: 'blast-mainnet',
    apiKey: ALCHEMY_API_KEY,
  },
  zksync: {
    name: 'zkSync Era',
    chainId: 324,
    rpcUrl: 'https://mainnet.era.zksync.io',
    apiKey: ALCHEMY_API_KEY,
  },
  mantle: {
    name: 'Mantle',
    chainId: 5000,
    rpcUrl: 'https://rpc.mantle.xyz',
    apiKey: ALCHEMY_API_KEY,
  },
  gnosis: {
    name: 'Gnosis',
    chainId: 100,
    rpcUrl: 'https://rpc.gnosischain.com',
    apiKey: ALCHEMY_API_KEY,
  },
};

export async function getTokenBalances(address, networkKey) {
  const config = NETWORK_CONFIG[networkKey];
  if (!config) throw new Error(`Unknown network: ${networkKey}`);

  const url = `https://${config.alchemyNetwork}.g.alchemy.com/v2/${config.apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'alchemy_getTokenBalances',
        params: [address, 'erc20'],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error(`Alchemy error for ${networkKey}:`, data.error);
      return [];
    }

    // Filter out zero balances and return tokens with metadata
    return (data.result?.tokenBalances || [])
      .filter((token) => token.tokenBalance !== '0')
      .map((token) => ({
        tokenAddress: token.contractAddress,
        balance: token.tokenBalance,
        network: networkKey,
        chainId: config.chainId,
      }));
  } catch (error) {
    console.error(`Failed to fetch balances for ${networkKey}:`, error);
    return [];
  }
}

export async function getTokenMetadata(tokenAddress, networkKey) {
  const config = NETWORK_CONFIG[networkKey];
  if (!config) throw new Error(`Unknown network: ${networkKey}`);

  const url = `https://${config.alchemyNetwork}.g.alchemy.com/v2/${config.apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'alchemy_getTokenMetadata',
        params: [tokenAddress],
      }),
    });

    const data = await response.json();
    return data.result || null;
  } catch (error) {
    console.error(`Failed to fetch metadata for ${tokenAddress}:`, error);
    return null;
  }
}

export async function scanAllNetworks(address) {
  const networks = Object.keys(NETWORK_CONFIG);
  const results = await Promise.all(
    networks.map((network) => getTokenBalances(address, network))
  );

  const allTokens = [];
  results.forEach((tokens) => {
    allTokens.push(...tokens);
  });

  return allTokens;
}

export { NETWORK_CONFIG };
