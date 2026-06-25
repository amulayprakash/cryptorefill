import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, itemCount, totalUsdt, removeItem, updateQuantity, closeCart, isOpen } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={closeCart}
      />

      {/* Drawer panel */}
      <div className="relative flex flex-col w-full max-w-[420px] h-full bg-white dark:bg-gray-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Your Cart{itemCount > 0 && <span className="ml-2 text-sm font-semibold text-gray-500 dark:text-gray-400">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>}
          </h2>
          <button
            onClick={closeCart}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-base font-semibold text-gray-500 dark:text-gray-400 mb-1">Your cart is empty</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Add some products to get started.</p>
              <button
                onClick={() => { closeCart(); navigate('/products'); }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={item.cartItemId}
                item={item}
                onRemove={() => removeItem(item.cartItemId)}
                onIncrease={() => updateQuantity(item.cartItemId, 1)}
                onDecrease={() => updateQuantity(item.cartItemId, -1)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total</span>
              <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                {totalUsdt.toFixed(2)} USDT
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

function CartItem({ item, onRemove, onIncrease, onDecrease }) {
  const lineTotal = (item.selectedPrice * item.quantity).toFixed(2);

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
      {/* Product image */}
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-700 shrink-0">
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = '/assets/placeholder_mockup.png'; }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.product.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">${item.selectedPrice} denomination</p>
        {/* Quantity stepper */}
        <div className="flex items-center gap-2 mt-1.5">
          <button
            onClick={onDecrease}
            className="w-6 h-6 rounded-md flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3 text-gray-700 dark:text-gray-300" />
          </button>
          <span className="text-sm font-bold text-gray-900 dark:text-white w-5 text-center">{item.quantity}</span>
          <button
            onClick={onIncrease}
            className="w-6 h-6 rounded-md flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Price + remove */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-sm font-extrabold text-gray-900 dark:text-white">${lineTotal}</span>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
