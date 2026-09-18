import { apiHttp } from '../http-client';
import { Coupon } from './schema';

export async function listCoupons(): Promise<Coupon[]> {
  const { data } = await apiHttp.get<Coupon[]>('/coupons');
  return data;
}
