import { Cart } from '@api/cart/schema';
import { Badge } from '@components/atoms/Badge';
import { Button } from '@components/atoms/Button';
import { CartItemRow } from '@components/molecules/CartItemRow';
import { CouponForm } from '@components/molecules/CouponForm';
import { formatCurrency } from '@shared/format';

interface CartPanelProps {
  cart: Cart;
  isMutating: boolean;
  onChangeQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  onCheckout: () => void;
  onStartNewCart: () => void;
}

export function CartPanel({
  cart,
  isMutating,
  onChangeQuantity,
  onRemoveItem,
  onApplyCoupon,
  onRemoveCoupon,
  onCheckout,
  onStartNewCart,
}: CartPanelProps) {
  const isFinalized = cart.status === 'FINALIZED';
  const isEmpty = cart.items.length === 0;

  return (
    <aside className="flex h-fit flex-col gap-4 rounded-card border border-hairline bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">Carrinho</h2>
        <Badge tone={isFinalized ? 'ok' : 'brand'}>{isFinalized ? 'Finalizado' : 'Aberto'}</Badge>
      </div>

      {isEmpty ? (
        <p className="py-6 text-center text-sm text-ink-muted">Seu carrinho está vazio.</p>
      ) : (
        <ul className="divide-y divide-hairline">
          {cart.items.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              isDisabled={isMutating || isFinalized}
              onChangeQuantity={(quantity) => onChangeQuantity(item.productId, quantity)}
              onRemove={() => onRemoveItem(item.productId)}
            />
          ))}
        </ul>
      )}

      <div className="border-t border-hairline pt-4">
        <CouponForm
          appliedCoupon={cart.coupon}
          isDisabled={isMutating || isFinalized || isEmpty}
          onApply={onApplyCoupon}
          onRemove={onRemoveCoupon}
        />
      </div>

      <dl className="space-y-1.5 border-t border-hairline pt-4 text-sm">
        <div className="flex justify-between text-ink-muted">
          <dt>Subtotal</dt>
          <dd>{formatCurrency(cart.subtotal)}</dd>
        </div>
        <div className="flex justify-between text-ink-muted">
          <dt>Desconto</dt>
          <dd>-{formatCurrency(cart.discount)}</dd>
        </div>
        <div className="flex justify-between text-base font-semibold text-ink">
          <dt>Total</dt>
          <dd>{formatCurrency(cart.total)}</dd>
        </div>
      </dl>

      {isFinalized ? (
        <Button variant="primary" className="w-full" onClick={onStartNewCart}>
          Começar nova compra
        </Button>
      ) : (
        <Button
          variant="primary"
          className="w-full"
          disabled={isEmpty || isMutating}
          isLoading={isMutating}
          onClick={onCheckout}
        >
          Finalizar compra
        </Button>
      )}
    </aside>
  );
}
