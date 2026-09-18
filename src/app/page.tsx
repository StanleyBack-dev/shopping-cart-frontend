'use client';

import { useState } from 'react';

import { ErrorBanner } from '@components/molecules/ErrorBanner';
import { CartPanel } from '@components/organisms/CartPanel';
import { ProductList } from '@components/organisms/ProductList';
import { useCart } from '@features/cart/use-cart';
import { useProducts } from '@features/products/use-products';

export default function Home() {
  const { products, isLoading: isLoadingProducts, error: productsError } = useProducts();
  const {
    cart,
    isLoading: isLoadingCart,
    isMutating,
    error: cartError,
    dismissError,
    addItem,
    updateItemQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    checkout,
    startNewCart,
  } = useCart();
  const [pendingProductId, setPendingProductId] = useState<number | null>(null);

  async function handleAdd(productId: number) {
    setPendingProductId(productId);
    await addItem(productId);
    setPendingProductId(null);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-ink">Catálogo</h1>
        <p className="text-sm text-ink-muted">Escolha os produtos e finalize sua compra.</p>
      </header>

      {(cartError ?? productsError) && (
        <div className="mb-6">
          <ErrorBanner message={cartError ?? productsError ?? ''} onDismiss={dismissError} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <section>
          {isLoadingProducts ? (
            <p className="text-sm text-ink-muted">Carregando catálogo…</p>
          ) : (
            <ProductList
              products={products}
              cart={cart}
              isMutating={isMutating}
              pendingProductId={pendingProductId}
              onAdd={handleAdd}
            />
          )}
        </section>

        <section>
          {isLoadingCart || !cart ? (
            <p className="text-sm text-ink-muted">Carregando carrinho…</p>
          ) : (
            <CartPanel
              cart={cart}
              isMutating={isMutating}
              onChangeQuantity={updateItemQuantity}
              onRemoveItem={removeItem}
              onApplyCoupon={applyCoupon}
              onRemoveCoupon={removeCoupon}
              onCheckout={checkout}
              onStartNewCart={startNewCart}
            />
          )}
        </section>
      </div>
    </main>
  );
}
