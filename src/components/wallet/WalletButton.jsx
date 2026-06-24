import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletModal } from './WalletModal';

const truncate = (addr) =>
  addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';

export function WalletButton() {
  const [open, setOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { connected: isTronConnected, address: tronAddress } = useWallet();

  const activeAddress = isConnected ? address : isTronConnected ? tronAddress : null;
  const isAnyConnected = isConnected || isTronConnected;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex h-9 items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 text-xs font-semibold shadow-xs hover:shadow-md transition-all gap-1.5 cursor-pointer"
      >
        <Wallet className="w-3.5 h-3.5" />
        {isAnyConnected ? truncate(activeAddress) : 'Connect wallet'}
      </button>

      <WalletModal open={open} onOpenChange={setOpen} />
    </>
  );
}
