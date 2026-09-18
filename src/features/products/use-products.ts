'use client';

import { useEffect, useState } from 'react';

import { listProducts } from '@api/products/methods';
import { Product } from '@api/products/schema';
import { getApiErrorMessage } from '@api/http-client';

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    listProducts()
      .then((data) => {
        if (isMounted) setProducts(data);
      })
      .catch((fetchError: unknown) => {
        if (isMounted) {
          setError(getApiErrorMessage(fetchError, 'Não foi possível carregar o catálogo.'));
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, isLoading, error };
}
