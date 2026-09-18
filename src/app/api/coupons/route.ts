import { relay } from '../_utils/relay';
import { listCoupons } from '@/server/modules/coupons.service';

export async function GET() {
  return relay(await listCoupons());
}
