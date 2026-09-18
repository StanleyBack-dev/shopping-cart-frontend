'use client';

import { ErrorBanner } from '@components/molecules/ErrorBanner';
import { CartPanel } from '@components/organisms/CartPanel';
import { HeroBanner } from '@components/organisms/HeroBanner';
import { ProductSection } from '@components/organisms/ProductSection';
import { SiteHeader } from '@components/organisms/SiteHeader';
import { CURATED_SECTIONS, pickProducts } from '@features/catalog/curated-sections';
import { useCatalogFilters } from '@features/catalog/use-catalog-filters';
import { useCart } from '@features/cart/use-cart';
import { useProducts } from '@features/products/use-products';

function scrollToCart() {
  document.getElementById('cart')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

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
  const { filters, filteredProducts, isFiltered, setSearch, setCategory, setSort } =
    useCatalogFilters(products);

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <>
      <SiteHeader
        cartItemCount={cartItemCount}
        onCartClick={scrollToCart}
        filters={filters}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onSortChange={setSort}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <HeroBanner />
        </div>

        {(cartError ?? productsError) && (
          <div className="mb-6">
            <ErrorBanner message={cartError ?? productsError ?? ''} onDismiss={dismissError} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-10">
            {isLoadingProducts ? (
              <p className="text-sm text-ink-muted">Carregando catálogo…</p>
            ) : isFiltered ? (
              <ProductSection
                title={`Resultados (${filteredProducts.length})`}
                products={filteredProducts}
                cart={cart}
                pendingProductIds={pendingProductIds}
                onAdd={addItem}
              />
            ) : (
              <>
                {CURATED_SECTIONS.map((section) => (
                  <ProductSection
                    key={section.title}
                    title={section.title}
                    subtitle={section.subtitle}
                    products={pickProducts(products, section.productIds)}
                    cart={cart}
                    pendingProductIds={pendingProductIds}
                    onAdd={addItem}
                  />
                ))}
                <ProductSection
                  title="Todos os produtos"
                  products={products}
                  cart={cart}
                  pendingProductIds={pendingProductIds}
                  onAdd={addItem}
                />
              </>
            )}
          </div>

          <div id="cart" className="scroll-mt-24">
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
          </div>
        </div>
      </main>
    </>
  );
}
