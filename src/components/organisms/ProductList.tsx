import { Cart } from '@api/cart/schema';
import { Product } from '@api/products/schema';
import { ProductCard } from '@components/molecules/ProductCard';

interface ProductListProps {
  products: Product[];
  cart: Cart | null;
  pendingProductIds: ReadonlySet<number>;
  onAdd: (productId: number) => void;
}

export function ProductList({ products, cart, pendingProductIds, onAdd }: ProductListProps) {
  const isCartFinalized = cart?.status === 'FINALIZED';

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => {
        const quantityInCart =
          cart?.items.find((item) => item.productId === product.id)?.quantity ?? 0;
        const isPending = pendingProductIds.has(product.id);

        return (
          <ProductCard
            key={product.id}
            product={product}
            quantityInCart={quantityInCart}
            isDisabled={isCartFinalized || isPending}
            isAdding={isPending}
            onAdd={() => onAdd(product.id)}
          />
        );
      })}
    </div>
  );
}
