'use client';

import { useMemo, useState } from 'react';

import { Product } from '@api/products/schema';

import {
  CatalogFilters,
  DEFAULT_CATALOG_FILTERS,
  filterAndSortProducts,
  isCatalogFiltered,
  SortOption,
} from './filter-products';
import { ProductCategory } from './product-presentation';

interface UseCatalogFiltersResult {
  filters: CatalogFilters;
  filteredProducts: Product[];
  isFiltered: boolean;
  setSearch: (search: string) => void;
  setCategory: (category: ProductCategory | 'all') => void;
  setSort: (sort: SortOption) => void;
}

export function useCatalogFilters(products: Product[]): UseCatalogFiltersResult {
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_CATALOG_FILTERS);

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters],
  );

  return {
    filters,
    filteredProducts,
    isFiltered: isCatalogFiltered(filters),
    setSearch: (search) => setFilters((prev) => ({ ...prev, search })),
    setCategory: (category) => setFilters((prev) => ({ ...prev, category })),
    setSort: (sort) => setFilters((prev) => ({ ...prev, sort })),
  };
}
