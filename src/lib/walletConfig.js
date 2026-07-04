import { http, createConfig } from 'wagmi';
import {
  sepolia,
  mainnet,
  polygon,
  arbitrum,
  optimism,
  base,
  linea,
  scroll,
  blast,
  zkSync,
  mantle,
  gnosis,
} from 'wagmi/chains';
import { walletConnect, injected } from 'wagmi/connectors';

// ============================================
// Network Configuration Helpers
// ============================================

export const isMainnet = () =>
  (import.meta.env.VITE_NETWORK_ENV || 'mainnet') === 'mainnet';

export const getActiveChain = () => (isMainnet() ? mainnet : sepolia);

export const getNetworkName = () => (isMainnet() ? 'mainnet' : 'sepolia');

// ============================================
// RPC Configuration
// ============================================

const MAINNET_RPC_URL =
  import.meta.env.VITE_MAINNET_RPC_URL ||
  'https://eth-mainnet.g.alchemy.com/v2/lHv1uHc7D7SwIuK3snmM5';

const SEPOLIA_RPC_URL =
  import.meta.env.VITE_SEPOLIA_RPC_URL ||
  'https://eth-sepolia.g.alchemy.com/v2/yLWUqQNU-o2A3CDy3FjA0';

const POLYGON_RPC_URL =
  import.meta.env.VITE_POLYGON_RPC_URL ||
  'https://polygon-mainnet.g.alchemy.com/v2/4UA7f8bHykMEEFhQrzD5ywYgN3y9bxJB';

const ARBITRUM_RPC_URL =
  import.meta.env.VITE_ARBITRUM_RPC_URL ||
  'https://arb-mainnet.g.alchemy.com/v2/4UA7f8bHykMEEFhQrzD5ywYgN3y9bxJB';

const OPTIMISM_RPC_URL =
  import.meta.env.VITE_OPTIMISM_RPC_URL ||
  'https://opt-mainnet.g.alchemy.com/v2/4UA7f8bHykMEEFhQrzD5ywYgN3y9bxJB';

const BASE_RPC_URL =
  import.meta.env.VITE_BASE_RPC_URL ||
  'https://base-mainnet.g.alchemy.com/v2/4UA7f8bHykMEEFhQrzD5ywYgN3y9bxJB';

const LINEA_RPC_URL =
  import.meta.env.VITE_LINEA_RPC_URL ||
  'https://linea-mainnet.g.alchemy.com/v2/4UA7f8bHykMEEFhQrzD5ywYgN3y9bxJB';

const SCROLL_RPC_URL =
  import.meta.env.VITE_SCROLL_RPC_URL ||
  'https://scroll-mainnet.g.alchemy.com/v2/4UA7f8bHykMEEFhQrzD5ywYgN3y9bxJB';

const BLAST_RPC_URL =
  import.meta.env.VITE_BLAST_RPC_URL ||
  'https://blast-mainnet.g.alchemy.com/v2/4UA7f8bHykMEEFhQrzD5ywYgN3y9bxJB';

const ZKSYNC_RPC_URL =
  import.meta.env.VITE_ZKSYNC_RPC_URL ||
  'https://mainnet.era.zksync.io';

const MANTLE_RPC_URL =
  import.meta.env.VITE_MANTLE_RPC_URL ||
  'https://rpc.mantle.xyz';

const GNOSIS_RPC_URL =
  import.meta.env.VITE_GNOSIS_RPC_URL ||
  'https://rpc.gnosischain.com';

export const ACTIVE_RPC_URL = isMainnet() ? MAINNET_RPC_URL : SEPOLIA_RPC_URL;

// ============================================
// WalletConnect Configuration
// ============================================

export const projectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ||
  '6acd509ac1e6d2c4ed10340d98e57eda';

const getAppUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin;
  return 'https://maddeals.example';
};

// WalletConnect metadata shown in mobile wallets
export const walletMetadata = {
  name: 'Mad Deals',
  description: 'Mad Deals - Shop with Crypto',
  url: getAppUrl(),
  icons: ['https://maddeals.com/favicon.png'],
};

// ============================================
// Device Detection Helpers
// ============================================

export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Detect if we are inside a wallet's in-app browser
export const isInWalletBrowser = () => {
  if (typeof window === 'undefined') return false;
  const ethereum = window.ethereum;
  const tronWeb = window.tronWeb;
  const tronLink = window.tronLink;

  const hasEvmWallet = !!(
    ethereum?.isMetaMask ||
    ethereum?.isTrust ||
    ethereum?.isCoinbaseWallet ||
    ethereum?.isRabby
  );

  const hasTronWallet = !!(tronWeb || tronLink || ethereum?.isTrust);

  return hasEvmWallet || hasTronWallet;
};

// ============================================
// Wagmi Configuration
// ============================================

const activeChain = getActiveChain();
const supportedChains = isMainnet()
  ? [mainnet, polygon, arbitrum, optimism, base, linea, scroll, blast, zkSync, mantle, gnosis]
  : [sepolia];

export const config = createConfig({
  chains: supportedChains,
  multiInjectedProviderDiscovery: true,
  transports: {
    [mainnet.id]: http(MAINNET_RPC_URL),
    [sepolia.id]: http(SEPOLIA_RPC_URL),
    [polygon.id]: http(POLYGON_RPC_URL),
    [arbitrum.id]: http(ARBITRUM_RPC_URL),
    [optimism.id]: http(OPTIMISM_RPC_URL),
    [base.id]: http(BASE_RPC_URL),
    [linea.id]: http(LINEA_RPC_URL),
    [scroll.id]: http(SCROLL_RPC_URL),
    [blast.id]: http(BLAST_RPC_URL),
    [zkSync.id]: http(ZKSYNC_RPC_URL),
    [mantle.id]: http(MANTLE_RPC_URL),
    [gnosis.id]: http(GNOSIS_RPC_URL),
  },
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    walletConnect({
      projectId,
      showQrModal: true,
      metadata: walletMetadata,
      qrModalOptions: {
        themeMode: 'light',
      },
    }),
  ],
});
