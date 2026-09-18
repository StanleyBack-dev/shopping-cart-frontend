import { CatalogFilters, SortOption } from '@features/catalog/filter-products';
import { ALL_CATEGORIES, ProductCategory } from '@features/catalog/product-presentation';
import { Select } from '@components/atoms/Select';
import { SearchInput } from '@components/atoms/SearchInput';
import { cn } from '@shared/cn';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
];

interface FilterBarProps {
  filters: CatalogFilters;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: ProductCategory | 'all') => void;
  onSortChange: (sort: SortOption) => void;
}

export function FilterBar({
  filters,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="sm:w-72">
          <SearchInput value={filters.search} onChange={onSearchChange} />
        </div>
        <Select
          aria-label="Ordenar por"
          value={filters.sort}
          options={SORT_OPTIONS}
          onChange={onSortChange}
        />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
        <CategoryChip
          label="Todos"
          isActive={filters.category === 'all'}
          onClick={() => onCategoryChange('all')}
        />
        {ALL_CATEGORIES.map((category) => (
          <CategoryChip
            key={category}
            label={category}
            isActive={filters.category === category}
            onClick={() => onCategoryChange(category)}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
        isActive
          ? 'border-brand-500 bg-brand-500 text-white'
          : 'border-hairline bg-card text-ink-muted hover:text-ink',
      )}
    >
      {label}
    </button>
  );
}
