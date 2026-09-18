import { apiHttp } from '../http-client';
import { Cart } from './schema';

export async function createCart(): Promise<Cart> {
  const { data } = await apiHttp.post<Cart>('/carts');
  return data;
}

export async function getCart(cartId: string): Promise<Cart> {
  const { data } = await apiHttp.get<Cart>(`/carts/${cartId}`);
  return data;
}

export async function addItem(cartId: string, productId: number, quantity = 1): Promise<Cart> {
  const { data } = await apiHttp.post<Cart>(`/carts/${cartId}/items`, { productId, quantity });
  return data;
}

export async function updateItemQuantity(
  cartId: string,
  productId: number,
  quantity: number,
): Promise<Cart> {
  const { data } = await apiHttp.patch<Cart>(`/carts/${cartId}/items/${productId}`, { quantity });
  return data;
}

export async function removeItem(cartId: string, productId: number): Promise<Cart> {
  const { data } = await apiHttp.delete<Cart>(`/carts/${cartId}/items/${productId}`);
  return data;
}

export async function applyCoupon(cartId: string, code: string): Promise<Cart> {
  const { data } = await apiHttp.post<Cart>(`/carts/${cartId}/coupon`, { code });
  return data;
}

export async function removeCoupon(cartId: string): Promise<Cart> {
  const { data } = await apiHttp.delete<Cart>(`/carts/${cartId}/coupon`);
  return data;
}

export async function checkoutCart(cartId: string): Promise<Cart> {
  const { data } = await apiHttp.post<Cart>(`/carts/${cartId}/checkout`);
  return data;
}
