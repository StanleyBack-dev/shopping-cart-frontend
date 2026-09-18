import { relay } from '../_utils/relay';
import { createCart } from '@/server/modules/cart.service';

export async function POST() {
  return relay(await createCart());
}
