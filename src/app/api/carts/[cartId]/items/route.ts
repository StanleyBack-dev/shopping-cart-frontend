import { relay } from '../../../_utils/relay';
import { addItem } from '@/server/modules/cart.service';

interface RouteContext {
  params: Promise<{ cartId: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  const { cartId } = await params;
  const body: unknown = await request.json();
  return relay(await addItem(cartId, body));
}
