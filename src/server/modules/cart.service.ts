import { backendHttp } from '../http-client';

export function createCart(): Promise<Response> {
  return backendHttp.post('/carts');
}

export function getCart(cartId: string): Promise<Response> {
  return backendHttp.get(`/carts/${cartId}`);
}

export function addItem(cartId: string, body: unknown): Promise<Response> {
  return backendHttp.post(`/carts/${cartId}/items`, body);
}

export function updateItemQuantity(
  cartId: string,
  productId: string,
  body: unknown,
): Promise<Response> {
  return backendHttp.patch(`/carts/${cartId}/items/${productId}`, body);
}

export function removeItem(cartId: string, productId: string): Promise<Response> {
  return backendHttp.delete(`/carts/${cartId}/items/${productId}`);
}

export function applyCoupon(cartId: string, body: unknown): Promise<Response> {
  return backendHttp.post(`/carts/${cartId}/coupon`, body);
}

export function removeCoupon(cartId: string): Promise<Response> {
  return backendHttp.delete(`/carts/${cartId}/coupon`);
}

export function checkout(cartId: string): Promise<Response> {
  return backendHttp.post(`/carts/${cartId}/checkout`);
}
