export function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div
      role="alert"
      className="flex items-start justify-between gap-3 rounded-card border border-err-border bg-err-bg px-4 py-3 text-sm text-err-fg"
    >
      <span>{message}</span>
      <button
        type="button"
        aria-label="Fechar aviso"
        onClick={onDismiss}
        className="shrink-0 font-medium text-err-fg/80 hover:text-err-fg"
      >
        ✕
      </button>
    </div>
  );
}
