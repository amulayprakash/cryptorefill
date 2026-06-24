import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletModal } from './WalletModal';

const truncate = (addr) =>
  addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';

export function WalletButton({ variant = 'desktop' }) {
  const [open, setOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { connected: isTronConnected, address: tronAddress } = useWallet();

  const activeAddress = isConnected ? address : isTronConnected ? tronAddress : null;
  const isAnyConnected = isConnected || isTronConnected;

  return (
    <>
      {variant === 'mobile' ? (
        <button
          aria-label={isAnyConnected ? 'Wallet connected' : 'Connect wallet'}
          onClick={() => setOpen(true)}
          className="lg:hidden cursor-pointer flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-md transition-all"
        >
          <Wallet className="w-4.5 h-4.5" />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="hidden lg:flex h-9 items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 text-xs font-semibold shadow-xs hover:shadow-md transition-all gap-1.5 cursor-pointer"
        >
          <Wallet className="w-3.5 h-3.5" />
          {isAnyConnected ? truncate(activeAddress) : 'Connect wallet'}
        </button>
      )}

      <WalletModal open={open} onOpenChange={setOpen} />
    </>
  );
}
