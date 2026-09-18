import { Product } from '@api/products/schema';

export interface CuratedSection {
  title: string;
  subtitle?: string;
  productIds: number[];
}

/**
 * Purely presentational merchandising sections — fixed, hand-picked product
 * ids grouped for display variety. The backend has no notion of "featured"
 * or "best seller" products; this only decides how the real catalog data is
 * grouped on the page.
 */
export const CURATED_SECTIONS: CuratedSection[] = [
  {
    title: 'Mais vendidos',
    subtitle: 'Os queridinhos de quem já montou o setup',
    productIds: [1, 4, 5, 9],
  },
  {
    title: 'Ofertas em destaque',
    subtitle: 'Boa relação custo-benefício para o dia a dia',
    productIds: [2, 3, 7, 8],
  },
];

export function pickProducts(products: Product[], productIds: number[]): Product[] {
  const byId = new Map(products.map((product) => [product.id, product]));
  return productIds
    .map((id) => byId.get(id))
    .filter((product): product is Product => Boolean(product));
}
