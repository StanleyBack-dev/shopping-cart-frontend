import { relay } from '../../../_utils/relay';
import { applyCoupon, removeCoupon } from '@/server/modules/cart.service';

interface RouteContext {
  params: Promise<{ cartId: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  const { cartId } = await params;
  const body: unknown = await request.json();
  return relay(await applyCoupon(cartId, body));
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { cartId } = await params;
  return relay(await removeCoupon(cartId));
}
