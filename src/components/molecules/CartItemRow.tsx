import { CartItem } from '@api/cart/schema';
import { QuantityInput } from '@components/atoms/QuantityInput';
import { formatCurrency } from '@shared/format';

interface CartItemRowProps {
  item: CartItem;
  isDisabled: boolean;
  onChangeQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemRow({ item, isDisabled, onChangeQuantity, onRemove }: CartItemRowProps) {
  return (
    <li className="flex flex-col gap-2 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">{item.description}</p>
          <p className="text-xs text-ink-muted">{formatCurrency(item.unitPrice)} / un.</p>
        </div>

        <button
          type="button"
          aria-label={`Remover ${item.description} do carrinho`}
          className="shrink-0 text-ink-subtle hover:text-err-fg disabled:cursor-not-allowed disabled:text-ink-subtle"
          disabled={isDisabled}
          onClick={onRemove}
        >
          ✕
        </button>
      </div>

      <div className="flex items-center justify-between">
        <QuantityInput
          value={item.quantity}
          max={item.availableStock}
          disabled={isDisabled}
          onChange={onChangeQuantity}
        />

        <p className="text-sm font-medium text-ink">{formatCurrency(item.lineTotal)}</p>
      </div>
    </li>
  );
}
