# Shopping Cart — Frontend

Frontend em **Next.js** (App Router) que consome a [API do carrinho de compras](https://github.com/StanleyBack-dev/shopping-cart-backend):
catálogo de produtos, carrinho, cupom, totais e finalização (checkout).

## Stack utilizada

- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS** com tokens de design via CSS variables (suporta tema claro/escuro automaticamente)
- **Axios** para chamadas HTTP
- **Docker** / **docker-compose**
- ESLint (`eslint-config-next`) + Prettier + Husky + lint-staged

## Estrutura

```
src/
├── app/                # Rotas do App Router (layout, página, estilos globais)
├── api/<domínio>/       # Camada de acesso à API: methods.ts (chamadas HTTP) + schema.ts (tipos)
│   ├── products/
│   ├── coupons/
│   └── cart/
├── features/<domínio>/  # Lógica de estado por funcionalidade (hooks que combinam api/ + useState)
│   ├── cart/            # useCart: bootstrap do carrinho, mutações, persistência do id
│   └── products/        # useProducts: carregamento do catálogo
├── components/
│   ├── atoms/           # Button, Badge, Spinner, QuantityInput
│   ├── molecules/       # ProductCard, CartItemRow, CouponForm, ErrorBanner
│   └── organisms/       # ProductList, CartPanel
└── shared/              # Utilitários (formatação de moeda, className helper)
```

Sem gerenciador de estado global (Redux/Zustand) — cada funcionalidade tem seu próprio hook
(`useCart`, `useProducts`) que encapsula chamadas à API e estado local com `useState`/`useEffect`, e a
página compõe esses hooks com os componentes de apresentação. Chamadas HTTP passam por uma instância única
do Axios (`api/http-client.ts`), com helpers (`getApiErrorMessage`/`getApiErrorCode`) que extraem a mensagem
tratada (em português) e o código de erro devolvidos pelo backend.

## Como funciona o carrinho

Não há autenticação: ao carregar a página, o app cria um carrinho novo na API e guarda o `id` retornado no
`localStorage` do navegador. Nas visitas seguintes, esse `id` é reaproveitado para buscar o mesmo carrinho; se
ele não existir mais no backend (`404 CART_NOT_FOUND`), um novo carrinho é criado automaticamente. Depois do
checkout, o botão "Começar nova compra" limpa o `id` salvo e cria um carrinho novo.

## Rodando localmente (sem Docker)

Pré-requisitos: Node.js 22+, npm, e a [API rodando](https://github.com/StanleyBack-dev/shopping-cart-backend)
(por padrão em `http://localhost:3000`).

```bash
npm install
cp .env.example .env.local   # ajuste NEXT_PUBLIC_API_URL se a API não estiver em localhost:3000
npm run dev
```

O app sobe em `http://localhost:3001` (ou na próxima porta livre, caso a 3000 esteja ocupada pela API).

## Rodando com Docker

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/v1 docker compose up --build
```

Isso sobe o frontend containerizado em `http://localhost:3001`, apontando para a API informada em
`NEXT_PUBLIC_API_URL` (que roda fora deste compose — suba o backend separadamente). Como `NEXT_PUBLIC_API_URL`
é embutida no bundle do cliente em tempo de build, ela é passada como build-arg no `docker-compose.yml`.

## Variáveis de ambiente

| Variável               | Descrição                                  | Padrão                          |
|--------------------------|-----------------------------------------------|-------------------------------------|
| `NEXT_PUBLIC_API_URL`     | URL base da API do carrinho de compras          | `http://localhost:3000/v1`          |

## Decisões de design e premissas assumidas

- **Sem página de login/usuário**: o backend não exige autenticação, então o carrinho é tratado como um
  carrinho anônimo, identificado só pelo seu `id`, salvo no `localStorage`.
- **Uma única página**: o fluxo completo (catálogo, carrinho, cupom, totais, checkout) cabe em uma tela só, o
  que é suficiente para o escopo do teste e evita navegação desnecessária.
- **Sem biblioteca de estado global**: dado o tamanho do app, hooks por funcionalidade (`useCart`,
  `useProducts`) já cobrem a necessidade sem a complexidade extra de Redux/Zustand/React Query.
- **Mensagens de erro**: toda mensagem de erro exibida ao usuário vem diretamente do campo `message` (em
  português) devolvido pela API — o frontend não duplica texto de validação, apenas repassa o que o backend
  já trata.
- **Tema claro/escuro**: os tokens de cor são definidos como CSS variables e reagem a
  `prefers-color-scheme`, sem exigir nenhuma configuração adicional.

## Pendências / próximos passos

- **Sem testes automatizados no frontend** — o fluxo completo foi validado manualmente no navegador (catálogo,
  adicionar/alterar/remover item, aplicar/substituir/remover cupom, checkout, bloqueio pós-checkout, erro de
  cupom inválido e de estoque insuficiente). Dado o prazo, o esforço de testes ficou concentrado no backend
  (regras de negócio); testes de componente/E2E (ex.: Playwright) seriam o próximo passo natural.
- **Sem paginação/busca** no catálogo — só faz sentido com mais de 10 produtos.
- **Sem confirmação visual dedicada de checkout** (ex.: número do pedido) — o carrinho finalizado permanece
  visível em modo somente leitura, o que já atende ao requisito de finalizar e bloquear alterações.
