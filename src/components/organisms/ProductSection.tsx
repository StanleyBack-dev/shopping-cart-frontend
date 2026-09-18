import { Cart } from '@api/cart/schema';
import { Product } from '@api/products/schema';
import { ProductList } from '@components/organisms/ProductList';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  cart: Cart | null;
  pendingProductIds: ReadonlySet<number>;
  onAdd: (productId: number) => void;
}

export function ProductSection({
  title,
  subtitle,
  products,
  cart,
  pendingProductIds,
  onAdd,
}: ProductSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {subtitle && <p className="text-sm text-ink-muted">{subtitle}</p>}
      </div>
      <ProductList
        products={products}
        cart={cart}
        pendingProductIds={pendingProductIds}
        onAdd={onAdd}
      />
    </section>
  );
}
