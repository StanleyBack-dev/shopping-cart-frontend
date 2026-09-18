import { Coupon } from '../coupons/schema';

export type CartStatus = 'OPEN' | 'FINALIZED';

export interface CartItem {
  productId: number;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  availableStock: number;
}

export interface Cart {
  id: string;
  status: CartStatus;
  items: CartItem[];
  coupon: Coupon | null;
  subtotal: number;
  discount: number;
  total: number;
  finalizedAt: string | null;
}
