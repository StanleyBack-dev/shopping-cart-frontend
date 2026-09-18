import { Product } from '@api/products/schema';
import { Badge } from '@components/atoms/Badge';
import { Button } from '@components/atoms/Button';
import { formatCurrency } from '@shared/format';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  isDisabled: boolean;
  isAdding: boolean;
  onAdd: () => void;
}

export function ProductCard({
  product,
  quantityInCart,
  isDisabled,
  isAdding,
  onAdd,
}: ProductCardProps) {
  const isOutOfStock = product.stockQuantity <= 0;
  const hasReachedStockLimit = quantityInCart >= product.stockQuantity;

  return (
    <div className="flex flex-col gap-3 rounded-card border border-hairline bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-ink">{product.description}</h3>
        {isOutOfStock ? (
          <Badge tone="muted">Sem estoque</Badge>
        ) : (
          <Badge tone="brand">{product.stockQuantity} em estoque</Badge>
        )}
      </div>

      <p className="text-lg font-semibold text-ink">{formatCurrency(product.netUnitPrice)}</p>

      {quantityInCart > 0 && <p className="text-xs text-ink-muted">{quantityInCart} no carrinho</p>}

      <Button
        variant="primary"
        className="mt-auto w-full"
        isLoading={isAdding}
        disabled={isDisabled || isOutOfStock || hasReachedStockLimit}
        onClick={onAdd}
      >
        {isOutOfStock
          ? 'Indisponível'
          : hasReachedStockLimit
            ? 'Estoque máximo no carrinho'
            : 'Adicionar ao carrinho'}
      </Button>
    </div>
  );
}
