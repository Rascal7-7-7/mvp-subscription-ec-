'use client';
import { useState, useEffect } from 'react';
import { CartItem } from '@/lib/types';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        // ignore malformed data
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.productId === item.productId && i.planId === item.planId
      );
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId && i.planId === item.planId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: number, planId: number) => {
    setItems(prev =>
      prev.filter(i => !(i.productId === productId && i.planId === planId))
    );
  };

  const updateQuantity = (productId: number, planId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, planId);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.productId === productId && i.planId === planId
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    items,
    loaded,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalAmount,
    totalItems,
  };
}
