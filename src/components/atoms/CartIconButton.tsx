import { ShoppingCart } from 'lucide-react';

interface CartIconButtonProps {
  itemCount: number;
  onClick: () => void;
}

export function CartIconButton({ itemCount, onClick }: CartIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Abrir carrinho, ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-page"
    >
      <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
      {itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}
