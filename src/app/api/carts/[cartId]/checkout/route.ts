import { relay } from '../../../_utils/relay';
import { checkout } from '@/server/modules/cart.service';

interface RouteContext {
  params: Promise<{ cartId: string }>;
}

export async function POST(_request: Request, { params }: RouteContext) {
  const { cartId } = await params;
  return relay(await checkout(cartId));
}
