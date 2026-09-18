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
  /** Product ids with an item-level mutation (add/update quantity/remove) in flight. */
  pendingProductIds: ReadonlySet<number>;
  isCouponPending: boolean;
  isCheckingOut: boolean;
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
  const [pendingProductIds, setPendingProductIds] = useState<ReadonlySet<number>>(new Set());
  const [isCouponPending, setIsCouponPending] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);
  const cartRef = useRef<Cart | null>(null);
  cartRef.current = cart;

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

  /** Runs a cart mutation scoped to a single product, without disabling anything else. */
  const runItemMutation = useCallback(async (productId: number, mutation: () => Promise<Cart>) => {
    setPendingProductIds((prev) => new Set(prev).add(productId));
    setError(null);

    try {
      const updatedCart = await mutation();
      setCart(updatedCart);
    } catch (mutationError) {
      setError(getApiErrorMessage(mutationError));
    } finally {
      setPendingProductIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  }, []);

  const addItem = useCallback(
    async (productId: number, quantity = 1) => {
      const cartId = cartRef.current?.id;
      if (!cartId) return;
      await runItemMutation(productId, () => addItemRequest(cartId, productId, quantity));
    },
    [runItemMutation],
  );

  const updateItemQuantity = useCallback(
    async (productId: number, quantity: number) => {
      const cartId = cartRef.current?.id;
      if (!cartId) return;
      await runItemMutation(productId, () =>
        updateItemQuantityRequest(cartId, productId, quantity),
      );
    },
    [runItemMutation],
  );

  const removeItem = useCallback(
    async (productId: number) => {
      const cartId = cartRef.current?.id;
      if (!cartId) return;
      await runItemMutation(productId, () => removeItemRequest(cartId, productId));
    },
    [runItemMutation],
  );

  const applyCoupon = useCallback(async (code: string) => {
    const cartId = cartRef.current?.id;
    if (!cartId) return;

    setIsCouponPending(true);
    setError(null);
    try {
      setCart(await applyCouponRequest(cartId, code));
    } catch (mutationError) {
      setError(getApiErrorMessage(mutationError));
    } finally {
      setIsCouponPending(false);
    }
  }, []);

  const removeCoupon = useCallback(async () => {
    const cartId = cartRef.current?.id;
    if (!cartId) return;

    setIsCouponPending(true);
    setError(null);
    try {
      setCart(await removeCouponRequest(cartId));
    } catch (mutationError) {
      setError(getApiErrorMessage(mutationError));
    } finally {
      setIsCouponPending(false);
    }
  }, []);

  const checkout = useCallback(async () => {
    const cartId = cartRef.current?.id;
    if (!cartId) return;

    setIsCheckingOut(true);
    setError(null);
    try {
      setCart(await checkoutCartRequest(cartId));
    } catch (mutationError) {
      setError(getApiErrorMessage(mutationError));
    } finally {
      setIsCheckingOut(false);
    }
  }, []);

  const startNewCart = useCallback(async () => {
    clearStoredCartId();
    await bootstrapCart();
  }, [bootstrapCart]);

  return {
    cart,
    isLoading,
    pendingProductIds,
    isCouponPending,
    isCheckingOut,
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
