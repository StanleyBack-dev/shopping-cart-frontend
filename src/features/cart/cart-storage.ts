const CART_ID_STORAGE_KEY = 'shopping-cart:cart-id';

export function readStoredCartId(): string | null {
  try {
    return window.localStorage.getItem(CART_ID_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function writeStoredCartId(cartId: string): void {
  try {
    window.localStorage.setItem(CART_ID_STORAGE_KEY, cartId);
  } catch {
    // Ignore storage failures (private browsing, quota, etc.) — the cart still
    // works for the current session, it just won't survive a reload.
  }
}

export function clearStoredCartId(): void {
  try {
    window.localStorage.removeItem(CART_ID_STORAGE_KEY);
  } catch {
    // See writeStoredCartId.
  }
}
