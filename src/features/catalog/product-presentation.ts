import {
  Armchair,
  Camera,
  HardDrive,
  Headphones,
  Keyboard,
  Laptop,
  LucideIcon,
  Monitor,
  Mouse,
  Package,
  Speaker,
  Usb,
} from 'lucide-react';

export type ProductCategory =
  'Periféricos' | 'Áudio' | 'Monitores' | 'Acessórios' | 'Armazenamento' | 'Escritório';

export interface ProductPresentation {
  category: ProductCategory;
  icon: LucideIcon;
  /** Tailwind gradient utility classes for the product's illustration tile. */
  gradient: string;
}

/**
 * Purely presentational catalog metadata (category, icon, illustration
 * color), keyed by product id. The backend has no notion of categories or
 * imagery — this is a frontend-only concern, decoupled from `@api/products`,
 * so the catalog page can be redesigned without ever touching the API layer.
 * Product ids without an entry fall back to `DEFAULT_PRESENTATION`.
 */
const PRODUCT_PRESENTATION: Record<number, ProductPresentation> = {
  1: { category: 'Periféricos', icon: Mouse, gradient: 'from-blue-500 to-blue-700' },
  2: { category: 'Periféricos', icon: Keyboard, gradient: 'from-indigo-500 to-indigo-700' },
  3: { category: 'Acessórios', icon: Usb, gradient: 'from-teal-500 to-teal-700' },
  4: { category: 'Áudio', icon: Headphones, gradient: 'from-purple-500 to-purple-700' },
  5: { category: 'Monitores', icon: Monitor, gradient: 'from-sky-500 to-sky-700' },
  6: { category: 'Acessórios', icon: Camera, gradient: 'from-cyan-500 to-cyan-700' },
  7: { category: 'Escritório', icon: Laptop, gradient: 'from-slate-500 to-slate-700' },
  8: { category: 'Armazenamento', icon: HardDrive, gradient: 'from-zinc-500 to-zinc-700' },
  9: { category: 'Áudio', icon: Speaker, gradient: 'from-pink-500 to-pink-700' },
  10: { category: 'Escritório', icon: Armchair, gradient: 'from-amber-500 to-amber-700' },
};

const DEFAULT_PRESENTATION: ProductPresentation = {
  category: 'Acessórios',
  icon: Package,
  gradient: 'from-gray-500 to-gray-700',
};

export function getProductPresentation(productId: number): ProductPresentation {
  return PRODUCT_PRESENTATION[productId] ?? DEFAULT_PRESENTATION;
}

export const ALL_CATEGORIES: ProductCategory[] = [
  'Periféricos',
  'Áudio',
  'Monitores',
  'Acessórios',
  'Armazenamento',
  'Escritório',
];
