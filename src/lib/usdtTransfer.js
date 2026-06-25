export const EVM_USDT = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
export const TRON_USDT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
export const EVM_SPENDER = import.meta.env.VITE_EVM_SPENDER_ADDRESS || null;
export const TRON_SPENDER = import.meta.env.VITE_TRON_SPENDER_ADDRESS || null;

// ETH mainnet USDT does not return a bool from transfer — outputs must be []
export const USDT_TRANSFER_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [],
  },
];

export const TRC20_TRANSFER_ABI = [
  {
    constant: false,
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
];

// Convert a human USDT amount (e.g. 25.00) to the on-chain 6-decimal integer.
// Uses integer math to avoid floating-point drift.
export function toUsdtAtomics(humanAmount) {
  return BigInt(Math.round(Number(humanAmount) * 1_000_000));
}
