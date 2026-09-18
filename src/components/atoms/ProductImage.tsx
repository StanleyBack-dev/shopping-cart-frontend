import { getProductPresentation } from '@features/catalog/product-presentation';
import { cn } from '@shared/cn';

interface ProductImageProps {
  productId: number;
  className?: string;
}

/**
 * Stand-in for product photography: a colored gradient tile with a category
 * icon, generated entirely from local, repo-owned data (see
 * `product-presentation.ts`) — no external images to fetch or host.
 */
export function ProductImage({ productId, className }: ProductImageProps) {
  const { icon: Icon, gradient, category } = getProductPresentation(productId);

  return (
    <div
      role="img"
      aria-label={category}
      className={cn(
        'flex items-center justify-center rounded-card bg-gradient-to-br',
        gradient,
        className,
      )}
    >
      <Icon className="h-10 w-10 text-white/90" strokeWidth={1.5} />
    </div>
  );
}
