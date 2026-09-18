'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  addItem as addItemRequest,
  applyCoupon as applyCouponRequest,
  checkoutCart as checkoutCartRequest,
  createCart,
  getCart,
  removeCoupon as removeCouponRequest,
  removeItem as removeItemRequest,
  updateItemQuantity as updateItemQuantityRequest,
} from '@api/cart/methods';
import { Cart } from '@api/cart/schema';
import { getApiErrorCode, getApiErrorMessage } from '@api/http-client';

import { clearStoredCartId, readStoredCartId, writeStoredCartId } from './cart-storage';

interface UseCartResult {
  cart: Cart | null;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  dismissError: () => void;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItemQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  checkout: () => Promise<void>;
  startNewCart: () => Promise<void>;
}

export function useCart(): UseCartResult {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  const bootstrapCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const storedCartId = readStoredCartId();

      if (storedCartId) {
        try {
          const existingCart = await getCart(storedCartId);
          setCart(existingCart);
          return;
        } catch (fetchError) {
          if (getApiErrorCode(fetchError) !== 'CART_NOT_FOUND') {
            throw fetchError;
          }
          clearStoredCartId();
        }
      }

      const newCart = await createCart();
      writeStoredCartId(newCart.id);
      setCart(newCart);
    } catch (bootstrapError) {
      setError(getApiErrorMessage(bootstrapError, 'Não foi possível carregar o carrinho.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;
    void bootstrapCart();
  }, [bootstrapCart]);

  const runMutation = useCallback(async (mutation: () => Promise<Cart>) => {
    setIsMutating(true);
    setError(null);

    try {
      const updatedCart = await mutation();
      setCart(updatedCart);
    } catch (mutationError) {
      setError(getApiErrorMessage(mutationError));
    } finally {
      setIsMutating(false);
    }
  }, []);

  const addItem = useCallback(
    async (productId: number, quantity = 1) => {
      if (!cart) return;
      await runMutation(() => addItemRequest(cart.id, productId, quantity));
    },
    [cart, runMutation],
  );

  const updateItemQuantity = useCallback(
    async (productId: number, quantity: number) => {
      if (!cart) return;
      await runMutation(() => updateItemQuantityRequest(cart.id, productId, quantity));
    },
    [cart, runMutation],
  );

  const removeItem = useCallback(
    async (productId: number) => {
      if (!cart) return;
      await runMutation(() => removeItemRequest(cart.id, productId));
    },
    [cart, runMutation],
  );

  const applyCoupon = useCallback(
    async (code: string) => {
      if (!cart) return;
      await runMutation(() => applyCouponRequest(cart.id, code));
    },
    [cart, runMutation],
  );

  const removeCoupon = useCallback(async () => {
    if (!cart) return;
    await runMutation(() => removeCouponRequest(cart.id));
  }, [cart, runMutation]);

  const checkout = useCallback(async () => {
    if (!cart) return;
    await runMutation(() => checkoutCartRequest(cart.id));
  }, [cart, runMutation]);

  const startNewCart = useCallback(async () => {
    clearStoredCartId();
    await bootstrapCart();
  }, [bootstrapCart]);

  return {
    cart,
    isLoading,
    isMutating,
    error,
    dismissError: () => setError(null),
    addItem,
    updateItemQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    checkout,
    startNewCart,
  };
}
