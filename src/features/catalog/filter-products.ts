import { Product } from '@api/products/schema';

import { getProductPresentation, ProductCategory } from './product-presentation';

export type SortOption = 'relevance' | 'price-asc' | 'price-desc';

export interface CatalogFilters {
  search: string;
  category: ProductCategory | 'all';
  sort: SortOption;
}

export const DEFAULT_CATALOG_FILTERS: CatalogFilters = {
  search: '',
  category: 'all',
  sort: 'relevance',
};

function normalize(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Pure, unit-testable filtering/sorting — no state, no I/O. */
export function filterAndSortProducts(products: Product[], filters: CatalogFilters): Product[] {
  const search = normalize(filters.search.trim());

  const filtered = products.filter((product) => {
    const matchesSearch = search === '' || normalize(product.description).includes(search);
    const matchesCategory =
      filters.category === 'all' ||
      getProductPresentation(product.id).category === filters.category;

    return matchesSearch && matchesCategory;
  });

  switch (filters.sort) {
    case 'price-asc':
      return [...filtered].sort((a, b) => a.netUnitPrice - b.netUnitPrice);
    case 'price-desc':
      return [...filtered].sort((a, b) => b.netUnitPrice - a.netUnitPrice);
    default:
      return filtered;
  }
}

export function isCatalogFiltered(filters: CatalogFilters): boolean {
  return filters.search.trim() !== '' || filters.category !== 'all';
}
