import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Lightweight modal primitive replacing shadcn/Radix Dialog.
 * - Backdrop + centered panel, rendered through a portal so it sits above the
 *   sticky header and Lenis scroll container.
 * - Esc / backdrop click close the dialog unless `preventClose` is set.
 */
export function Dialog({
  open,
  onOpenChange,
  children,
  className,
  preventClose = false,
  showClose = true,
  wrapperZ = 'z-[100]',
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && !preventClose) onOpenChange(false);
    };
    document.addEventListener('keydown', onKey);
    // Lock background scroll while open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, preventClose, onOpenChange]);

  if (!open) return null;

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center p-4',
        wrapperZ
      )}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !preventClose && onOpenChange(false)}
      />
      {/* Panel */}
      <div
        className={cn(
          'relative w-full max-w-[400px] rounded-2xl bg-white dark:bg-[#0d0f11] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white shadow-2xl shadow-black/30 overflow-hidden',
          className
        )}
      >
        {showClose && (
          <button
            type="button"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:text-white/50 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
