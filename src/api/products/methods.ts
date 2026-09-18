import { apiHttp } from '../http-client';
import { Product } from './schema';

export async function listProducts(): Promise<Product[]> {
  const { data } = await apiHttp.get<Product[]>('/products');
  return data;
}
