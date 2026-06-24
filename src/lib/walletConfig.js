import { http, createConfig } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
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
  icons: ['https://www.cryptorefills.com/favicon.ico'],
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

export const config = createConfig({
  chains: [activeChain],
  multiInjectedProviderDiscovery: true,
  transports: {
    [mainnet.id]: http(MAINNET_RPC_URL),
    [sepolia.id]: http(SEPOLIA_RPC_URL),
  },
  connectors: [
    // Installed browser wallets (MetaMask, Rabby, etc.) are surfaced
    // automatically via EIP-6963 (multiInjectedProviderDiscovery below) and
    // connect straight to the extension. We intentionally do NOT use the
    // metaMask() SDK connector: it deep-links to the MetaMask *mobile app*
    // whenever it sees a mobile user-agent, which fails for desktop-extension
    // users. `injected` is the universal fallback.
    injected({
      shimDisconnect: true,
    }),
    // WalletConnect - mobile wallets via QR / deep links.
    // showQrModal:true => the official @walletconnect/modal opens with the full
    // searchable wallet list (MetaMask, Trust, Rainbow, …) plus a QR code. This
    // requires the @walletconnect/ethereum-provider + @walletconnect/modal peer
    // deps to be installed.
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
