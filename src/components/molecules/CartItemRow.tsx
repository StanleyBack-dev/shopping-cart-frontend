import { useEffect, useState } from 'react';

import { CartItem } from '@api/cart/schema';
import { QuantityInput } from '@components/atoms/QuantityInput';
import { useDebouncedCallback } from '@shared/use-debounced-callback';
import { formatCurrency } from '@shared/format';

const QUANTITY_COMMIT_DELAY_MS = 450;

interface CartItemRowProps {
  item: CartItem;
  /** True only while a request for THIS item is actually in flight. */
  isPending: boolean;
  /** True when the cart itself can no longer be edited (finalized). */
  isLocked: boolean;
  onChangeQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemRow({
  item,
  isPending,
  isLocked,
  onChangeQuantity,
  onRemove,
}: CartItemRowProps) {
  // Local draft so clicking +/- feels instant; the actual request is
  // debounced and coalesces a burst of clicks into a single commit.
  const [draftQuantity, setDraftQuantity] = useState(item.quantity);
  const commitQuantity = useDebouncedCallback(onChangeQuantity, QUANTITY_COMMIT_DELAY_MS);

  useEffect(() => {
    setDraftQuantity(item.quantity);
  }, [item.quantity]);

  function handleChange(quantity: number) {
    setDraftQuantity(quantity);
    commitQuantity(quantity);
  }

  const isDisabled = isLocked || isPending;

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
          value={draftQuantity}
          max={item.availableStock}
          disabled={isDisabled}
          onChange={handleChange}
        />

        <p className="text-sm font-medium text-ink">{formatCurrency(item.lineTotal)}</p>
      </div>
    </li>
  );
}
