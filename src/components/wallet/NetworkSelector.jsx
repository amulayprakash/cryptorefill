import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

// Ethereum Logo SVG
const EthereumLogo = () => (
  <svg viewBox="0 0 256 417" className="w-8 h-8" preserveAspectRatio="xMidYMid">
    <path fill="#627EEA" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" />
    <path fill="#8C9AE8" d="M127.962 0L0 212.32l127.962 75.639V154.158z" />
    <path fill="#627EEA" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" />
    <path fill="#8C9AE8" d="M127.962 416.905v-104.72L0 236.585z" />
    <path fill="#404C8C" d="M127.961 287.958l127.96-75.637-127.96-58.162z" />
    <path fill="#627EEA" d="M0 212.32l127.96 75.638v-133.8z" />
  </svg>
);

// TRON Logo SVG
const TronLogo = () => (
  <svg viewBox="0 0 64 64" className="w-8 h-8">
    <circle cx="32" cy="32" r="32" fill="#EF0027" />
    <path
      d="M46.8 19.2L21.6 14l-7.2 36.8L46.8 19.2zM24.8 18.4l16 3.2-16.8 16-0.8-18.4 1.6-0.8zM18.4 44.8l4.8-24 1.6 18.4-6.4 5.6z"
      fill="white"
    />
  </svg>
);

export function NetworkSelector({ value, onChange }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        {/* Ethereum Option */}
        <button
          type="button"
          onClick={() => onChange('ethereum')}
          className={cn(
            'group relative flex items-center w-full p-4 rounded-xl border transition-all duration-300 outline-none focus:ring-2 focus:ring-[#627EEA]/50',
            'bg-gray-50 dark:bg-[#111316] border-gray-200 dark:border-white/10',
            'hover:border-[#627EEA]/60 hover:bg-[#627EEA]/5',
            value === 'ethereum' &&
              'border-[#627EEA] bg-[#627EEA]/10 shadow-[0_0_20px_rgba(98,126,234,0.15)]'
          )}
        >
          <div
            className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center mr-4 transition-all duration-300',
              'bg-[#627EEA]/10 group-hover:bg-[#627EEA]/20 group-hover:scale-105',
              value === 'ethereum' && 'bg-[#627EEA]/20'
            )}
          >
            <EthereumLogo />
          </div>

          <div className="flex-1 text-left">
            <span className="block font-bold text-base text-gray-900 dark:text-white">
              Ethereum
            </span>
            <span className="text-xs text-gray-500 dark:text-white/50 mt-0.5 block">
              MetaMask, Trust Wallet, WalletConnect
            </span>
          </div>

          <ChevronRight
            className={cn(
              'w-5 h-5 text-gray-300 dark:text-white/20 group-hover:text-[#627EEA] group-hover:translate-x-1 transition-all duration-300',
              value === 'ethereum' && 'text-[#627EEA]'
            )}
          />

          {value === 'ethereum' && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#627EEA] animate-pulse" />
          )}
        </button>

        {/* TRON Option */}
        <button
          type="button"
          onClick={() => onChange('tron')}
          className={cn(
            'group relative flex items-center w-full p-4 rounded-xl border transition-all duration-300 outline-none focus:ring-2 focus:ring-[#EF0027]/50',
            'bg-gray-50 dark:bg-[#111316] border-gray-200 dark:border-white/10',
            'hover:border-[#EF0027]/60 hover:bg-[#EF0027]/5',
            value === 'tron' &&
              'border-[#EF0027] bg-[#EF0027]/10 shadow-[0_0_20px_rgba(239,0,39,0.15)]'
          )}
        >
          <div
            className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center mr-4 transition-all duration-300',
              'bg-[#EF0027]/10 group-hover:bg-[#EF0027]/20 group-hover:scale-105',
              value === 'tron' && 'bg-[#EF0027]/20'
            )}
          >
            <TronLogo />
          </div>

          <div className="flex-1 text-left">
            <span className="block font-bold text-base text-gray-900 dark:text-white">
              TRON
            </span>
            <span className="text-xs text-gray-500 dark:text-white/50 mt-0.5 block">
              TronLink, Trust Wallet, WalletConnect
            </span>
          </div>

          <ChevronRight
            className={cn(
              'w-5 h-5 text-gray-300 dark:text-white/20 group-hover:text-[#EF0027] group-hover:translate-x-1 transition-all duration-300',
              value === 'tron' && 'text-[#EF0027]'
            )}
          />

          {value === 'tron' && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF0027] animate-pulse" />
          )}
        </button>
      </div>

      <p className="text-[10px] text-gray-400 dark:text-white/40 text-center pt-2">
        Select your preferred blockchain network
      </p>
    </div>
  );
}
