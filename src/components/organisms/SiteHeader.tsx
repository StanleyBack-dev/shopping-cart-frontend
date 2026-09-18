import { ShoppingBag } from 'lucide-react';

import { CatalogFilters, SortOption } from '@features/catalog/filter-products';
import { ProductCategory } from '@features/catalog/product-presentation';
import { CartIconButton } from '@components/atoms/CartIconButton';
import { FilterBar } from '@components/molecules/FilterBar';

interface SiteHeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  filters: CatalogFilters;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: ProductCategory | 'all') => void;
  onSortChange: (sort: SortOption) => void;
}

export function SiteHeader({
  cartItemCount,
  onCartClick,
  filters,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-hairline bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-ink">
            <ShoppingBag className="h-5 w-5 text-brand-500" strokeWidth={1.75} />
            <span className="font-semibold">Nimbus Store</span>
          </div>

          <div className="hidden flex-1 lg:block">
            <FilterBar
              filters={filters}
              onSearchChange={onSearchChange}
              onCategoryChange={onCategoryChange}
              onSortChange={onSortChange}
            />
          </div>

          <CartIconButton itemCount={cartItemCount} onClick={onCartClick} />
        </div>

        <div className="lg:hidden">
          <FilterBar
            filters={filters}
            onSearchChange={onSearchChange}
            onCategoryChange={onCategoryChange}
            onSortChange={onSortChange}
          />
        </div>
      </div>
    </header>
  );
}
