import { relay } from '../../../../_utils/relay';
import { removeItem, updateItemQuantity } from '@/server/modules/cart.service';

interface RouteContext {
  params: Promise<{ cartId: string; productId: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { cartId, productId } = await params;
  const body: unknown = await request.json();
  return relay(await updateItemQuantity(cartId, productId, body));
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { cartId, productId } = await params;
  return relay(await removeItem(cartId, productId));
}
