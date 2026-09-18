import { cn } from '@shared/cn';

type Tone = 'ok' | 'brand' | 'muted';

const TONE_CLASSES: Record<Tone, string> = {
  ok: 'bg-ok-bg text-ok-fg border-ok-border',
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
  muted: 'bg-page text-ink-muted border-hairline',
};

export function Badge({ tone = 'muted', children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        TONE_CLASSES[tone],
      )}
    >
      {children}
    </span>
  );
}
