'use client';

import { FormEvent, useState } from 'react';

import { Coupon } from '@api/coupons/schema';
import { Badge } from '@components/atoms/Badge';
import { Button } from '@components/atoms/Button';

interface CouponFormProps {
  appliedCoupon: Coupon | null;
  isDisabled: boolean;
  onApply: (code: string) => void;
  onRemove: () => void;
}

export function CouponForm({ appliedCoupon, isDisabled, onApply, onRemove }: CouponFormProps) {
  const [code, setCode] = useState('');

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between gap-2">
        <Badge tone="ok">
          Cupom {appliedCoupon.code} (-{appliedCoupon.discountPercentage}%)
        </Badge>
        <Button variant="ghost" disabled={isDisabled} onClick={onRemove}>
          Remover
        </Button>
      </div>
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    onApply(trimmed);
    setCode('');
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        value={code}
        onChange={(event) => setCode(event.target.value.toUpperCase())}
        placeholder="Código do cupom"
        disabled={isDisabled}
        className="min-w-0 flex-1 rounded-card border border-hairline bg-card px-3 py-2 text-sm text-ink placeholder:text-ink-subtle disabled:opacity-60"
      />
      <Button type="submit" variant="secondary" disabled={isDisabled || !code.trim()}>
        Aplicar
      </Button>
    </form>
  );
}
