/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect, useState } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(i => i.cartItemId === action.item.cartItemId);
      if (existing) {
        return state.map(i =>
          i.cartItemId === action.item.cartItemId
            ? { ...i, quantity: i.quantity + action.item.quantity }
            : i
        );
      }
      return [...state, action.item];
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.cartItemId !== action.cartItemId);
    case 'UPDATE_QUANTITY': {
      const updated = state.map(i =>
        i.cartItemId === action.cartItemId
          ? { ...i, quantity: i.quantity + action.delta }
          : i
      );
      return updated.filter(i => i.quantity > 0);
    }
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

function loadCartFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('maddeals_cart_v1')) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCartFromStorage);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('maddeals_cart_v1', JSON.stringify(items));
  }, [items]);

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const totalUsdt = items.reduce((s, i) => s + i.selectedPrice * i.quantity, 0);

  const addItem = (product, selectedPrice, quantity = 1) =>
    dispatch({
      type: 'ADD_ITEM',
      item: {
        cartItemId: `${product.id}-${selectedPrice}`,
        product,
        selectedPrice,
        quantity,
      },
    });

  const removeItem = (cartItemId) =>
    dispatch({ type: 'REMOVE_ITEM', cartItemId });

  const updateQuantity = (cartItemId, delta) =>
    dispatch({ type: 'UPDATE_QUANTITY', cartItemId, delta });

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalUsdt,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
