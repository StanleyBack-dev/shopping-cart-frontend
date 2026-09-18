import { cn } from '@shared/cn';

interface QuantityInputProps {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

export function QuantityInput({ value, min = 1, max, disabled, onChange }: QuantityInputProps) {
  const canDecrease = !disabled && value > min;
  const canIncrease = !disabled && (max === undefined || value < max);

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-card border border-hairline bg-card',
        disabled && 'opacity-60',
      )}
    >
      <button
        type="button"
        aria-label="Diminuir quantidade"
        className="px-3 py-1.5 text-ink-muted hover:text-ink disabled:cursor-not-allowed disabled:text-ink-subtle"
        disabled={!canDecrease}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <span className="min-w-[2ch] text-center text-sm font-medium tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Aumentar quantidade"
        className="px-3 py-1.5 text-ink-muted hover:text-ink disabled:cursor-not-allowed disabled:text-ink-subtle"
        disabled={!canIncrease}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}
