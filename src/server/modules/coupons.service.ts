import { backendHttp } from '../http-client';

export function listCoupons(): Promise<Response> {
  return backendHttp.get('/coupons');
}
