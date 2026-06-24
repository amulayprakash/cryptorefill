import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2 } from 'lucide-react';
import { Dialog } from './Dialog';

export function TronWalletConnectQRModal({ open, uri, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (uri) {
      navigator.clipboard.writeText(uri);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => !o && onClose()}
      className="max-w-[360px]"
      wrapperZ="z-[120]"
    >
      <div className="p-6">
        <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-4">
          WalletConnect
        </h3>
        <div className="flex flex-col items-center gap-4">
          <div className="w-[200px] h-[200px] rounded-xl bg-white p-4 flex items-center justify-center">
            {uri ? (
              <QRCodeSVG value={uri} size={168} level="M" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#0d0f11]">
                <Loader2 className="w-10 h-10 animate-spin" />
                <span className="text-xs">Generating QR code...</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-white/60 text-center">
            Scan this QR Code with your phone
          </p>
          {uri && (
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg border border-gray-300 dark:border-white/20 px-4 py-2 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
