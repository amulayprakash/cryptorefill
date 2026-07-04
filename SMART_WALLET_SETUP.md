# Smart Wallet Detection System

## Overview

The smart wallet detection system automatically scans a user's EVM wallet across multiple blockchain networks (Ethereum, Polygon, Arbitrum, Optimism) to find which network contains the most valuable ERC20 tokens. After wallet connection, it silently detects the best network and automatically switches to it.

## How It Works (Ultra-Seamless Flow)

1. **User clicks "Connect Wallet"** → Modal opens
2. **No network selection needed** → Defaults to EVM, skips selection screen
3. **User picks wallet** → Shows only EVM wallets (MetaMask, Trust, WalletConnect, etc.)
4. **Wallet connects** → User connects their preferred wallet
5. **System auto-scans background** → Fetches token balances across ALL 12 networks
6. **Calculate total value** → Uses CoinGecko API to get current prices per network
7. **Auto-switch to best network** → Silently switches to network with highest total token value
8. **Done!** → User is connected to their optimal network with maximum assets

## User Flow Diagram

```
┌─────────────────────────────────────┐
│ User clicks "Connect Wallet"        │
└────────────────┬────────────────────┘
                 ↓
     ✅ Network Selection SKIPPED
         (Auto-defaults to EVM)
                 ↓
┌─────────────────────────────────────┐
│ User sees wallet list               │
│ • MetaMask                          │
│ • Trust Wallet                      │
│ • WalletConnect                     │
│ • Rabby, etc.                       │
└────────────────┬────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│ User picks wallet & signs in        │
└────────────────┬────────────────────┘
                 ↓
    🔄 BACKGROUND MAGIC:
    ├─ Scans 12 networks
    ├─ Fetches token balances
    ├─ Gets prices from CoinGecko
    ├─ Calculates USD value per network
    └─ Finds network with max value
                 ↓
┌─────────────────────────────────────┐
│ ✅ Auto-switched to best network    │
│                                     │
│ User is ready to trade!             │
└─────────────────────────────────────┘
```

## Setup Instructions

### 1. Get Alchemy API Keys

Visit [https://www.alchemy.com/](https://www.alchemy.com/) and create an account:

1. Create or select an app for each network:
   - Ethereum Mainnet
   - Polygon Mainnet
   - Arbitrum One
   - Optimism Mainnet

2. Copy the API keys for each network

### 2. Update Environment Variables

All networks are pre-configured with public RPC endpoints. Your Alchemy API key is automatically used for:
- Ethereum
- Polygon
- Arbitrum
- Optimism
- Base
- Linea
- Scroll
- Blast

Other networks (zkSync, Mantle, Gnosis) use public endpoints with no auth required.

If you want custom RPC endpoints, add to `.env`:

```env
# Alchemy endpoints (with your API key)
VITE_MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_OPTIMISM_RPC_URL=https://opt-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_LINEA_RPC_URL=https://linea-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_SCROLL_RPC_URL=https://scroll-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_BLAST_RPC_URL=https://blast-mainnet.g.alchemy.com/v2/YOUR_KEY

# Other public endpoints (optional)
VITE_ZKSYNC_RPC_URL=https://mainnet.era.zksync.io
VITE_MANTLE_RPC_URL=https://rpc.mantle.xyz
VITE_GNOSIS_RPC_URL=https://rpc.gnosischain.com
```

### 3. Dependencies

The system uses the following libraries (already included):
- **wagmi** - Wallet connection and network switching
- **viem** - EVM interactions
- **CoinGecko API** - Free token price data (no auth needed)
- **Alchemy API** - Token balance scanning

## Features

### 🚀 Ultra-Seamless User Experience
- ✅ **No manual network selection** - Defaults to EVM, skips selection screen
- ✅ **Direct to wallets** - User sees wallet list immediately
- ✅ **Background auto-detection** - Scans 12 networks silently after connection
- ✅ **Automatic network switch** - Switches to best network with most assets (USD value)
- ✅ **No user interaction needed** - All happens automatically, zero friction

### Supported Networks (12 Major Networks!)
- **Ethereum Mainnet** (chainId: 1)
- **Polygon** (chainId: 137)
- **Arbitrum One** (chainId: 42161)
- **Optimism** (chainId: 10)
- **Base** (chainId: 8453)
- **Linea** (chainId: 59144)
- **Scroll** (chainId: 534352)
- **Blast** (chainId: 81457)
- **zkSync Era** (chainId: 324)
- **Mantle** (chainId: 5000)
- **Gnosis** (chainId: 100)

### What Gets Scanned
- **Tokens**: ERC20 tokens with balance > 0
- **Data**: Token contract address, balance, and USD price
- **Scope**: Only balances are read; no transactions are made

### Price Caching
- Token prices are cached for 5 minutes to minimize API calls
- Prices are fetched from CoinGecko (free, public API)

## Technical Details

### Files Created

1. **`src/lib/alchemyBalance.js`**
   - `getTokenBalances(address, networkKey)` - Fetch balances on a single network
   - `scanAllNetworks(address)` - Scan all supported networks
   - `getTokenMetadata(tokenAddress, networkKey)` - Get token info

2. **`src/lib/tokenPrice.js`**
   - `getTokenPrice(tokenAddress, network)` - Get price for a token
   - `getTokenPricesBatch(tokens)` - Batch fetch prices with caching
   - `clearPriceCache()` - Clear the price cache

3. **`src/hooks/useSmartNetworkDetection.js`**
   - `useSmartNetworkDetection()` - Main hook
   - `detectBestNetwork(address)` - Analyze wallet and return best network
   - `switchToBestNetwork(address)` - Auto-detect and switch

### Integration Points

The system integrates into `src/components/wallet/WalletModal.jsx`:
- Automatically triggers after EVM wallet connection
- Runs in background without blocking UI
- Falls back gracefully if network detection fails

## Error Handling

The system handles errors gracefully:
- Missing API keys → Uses fallback defaults
- Network timeouts → Logs error, continues without switching
- Invalid addresses → Skips silently
- No tokens found → Does not switch network

## Advanced Configuration

### Add More Networks

To add support for additional EVM networks:

1. Update `src/lib/alchemyBalance.js`:
```javascript
const NETWORK_CONFIG = {
  // ... existing networks
  bsc: {
    name: 'Binance Smart Chain',
    chainId: 56,
    alchemyNetwork: 'bsc-mainnet',
    apiKey: import.meta.env.VITE_BSC_ALCHEMY_KEY,
  },
};
```

2. Add to `src/lib/walletConfig.js` wagmi config
3. Add environment variable for API key

### Customize "Best Network" Logic

Modify `src/hooks/useSmartNetworkDetection.js`:

```javascript
// Current: highest total USD value
// Could change to:
// - Highest single token value
// - Most tokens on a network
// - Custom token preference
```

### Token Filtering

Modify token scanning in `alchemyBalance.js`:

```javascript
// Current: filters out zero balances
// Add more filters like:
// - Minimum balance threshold
// - Specific token whitelist/blacklist
// - Token age requirements
```

## Troubleshooting

### Network detection not working
1. Check browser console for errors
2. Verify Alchemy API key is valid in `.env`
3. Ensure wallet has tokens on one of the supported networks
4. Check network is supported (see list above - 12 major networks)
5. Try connecting to a different wallet

### Auto-switch not happening
1. Verify `VITE_NETWORK_ENV=mainnet` (testnet not supported yet)
2. Check that wallet can switch networks (some wallets restrict this)
3. Verify best network is different from current network
4. Wait 2-5 seconds for initial scan to complete

### Incorrect network selection
1. Prices may be outdated (cache expires in 5 minutes, clear with F12 console)
2. Token decimals default to 18 (may be wrong for some tokens)
3. Check CoinGecko for token price data accuracy
4. Try disconnecting and reconnecting wallet

## Performance Notes

- First scan may take 2-5 seconds (12 networks × token fetches in parallel)
- Subsequent scans are faster due to price caching
- Runs in background, doesn't block wallet modal
- No impact on browser performance

## Security Notes

- Only reads token balances (no transaction capability)
- No private keys accessed or stored
- Prices from public CoinGecko API
- Network switching uses standard wagmi/web3 methods
- No data is sent to external servers except Alchemy and CoinGecko

## Testing

To test the feature:

1. Connect a wallet with tokens on multiple networks
2. Check browser console for debug logs
3. Network should automatically switch
4. Verify correct network is selected
5. Test fallback behavior with empty wallet

## Future Improvements

- [ ] Fetch actual token decimals from token metadata
- [ ] Add TRON network support
- [ ] Additional networks (BSC, Avalanche, Fantom, Celo, Aptos, Sui, etc.)
- [ ] Custom sorting preferences per user (highest value, most tokens, custom list)
- [ ] Show network analysis UI (display which networks have what value)
- [ ] Add manual network selection override
- [ ] Testnet support (Sepolia scanning)
- [ ] Real-time price updates instead of 5-min cache
- [ ] Gas price comparison for network selection
- [ ] Token stability scores (ignore whale-held tokens)
- [ ] Whitelist/blacklist specific tokens
