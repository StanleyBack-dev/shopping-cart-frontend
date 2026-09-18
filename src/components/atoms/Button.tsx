import { ButtonHTMLAttributes } from 'react';

import { cn } from '@shared/cn';

import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 disabled:bg-brand-300',
  secondary: 'bg-card text-ink border border-hairline hover:bg-page disabled:text-ink-subtle',
  danger:
    'bg-transparent text-err-fg border border-err-border hover:bg-err-bg disabled:text-ink-subtle disabled:border-hairline',
  ghost: 'bg-transparent text-ink-muted hover:text-ink disabled:text-ink-subtle',
};

export function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-card px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        className,
      )}
      disabled={disabled ?? isLoading}
      {...rest}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}
