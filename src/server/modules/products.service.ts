import { backendHttp } from '../http-client';

export function listProducts(): Promise<Response> {
  return backendHttp.get('/products');
}
