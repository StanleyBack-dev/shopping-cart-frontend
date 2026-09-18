import { relay } from '../_utils/relay';
import { listProducts } from '@/server/modules/products.service';

export async function GET() {
  return relay(await listProducts());
}
