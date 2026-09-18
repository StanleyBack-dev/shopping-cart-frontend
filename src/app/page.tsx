'use client';

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
    pendingProductIds,
    isCouponPending,
    isCheckingOut,
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
              pendingProductIds={pendingProductIds}
              onAdd={addItem}
            />
          )}
        </section>

        <section>
          {isLoadingCart || !cart ? (
            <p className="text-sm text-ink-muted">Carregando carrinho…</p>
          ) : (
            <CartPanel
              cart={cart}
              pendingProductIds={pendingProductIds}
              isCouponPending={isCouponPending}
              isCheckingOut={isCheckingOut}
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
