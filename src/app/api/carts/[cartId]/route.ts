import { relay } from '../../_utils/relay';
import { getCart } from '@/server/modules/cart.service';

interface RouteContext {
  params: Promise<{ cartId: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { cartId } = await params;
  return relay(await getCart(cartId));
}
