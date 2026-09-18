import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Carrinho de Compras',
  description: 'Catálogo, carrinho, cupons e finalização de compra.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
