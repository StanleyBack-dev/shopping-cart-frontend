# Shopping Cart — Frontend

Frontend em **Next.js** (App Router) que consome a [API do carrinho de compras](https://github.com/StanleyBack-dev/shopping-cart-backend):
catálogo de produtos, carrinho, cupom, totais e finalização (checkout).

Segue o padrão **BFF (Backend for Frontend)**: o navegador só conversa com o próprio servidor Next.js (mesma
origem); é o Next.js quem repassa as chamadas para a API NestJS real, que fica invisível para o cliente.

## Stack utilizada

- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS** com tokens de design via CSS variables (suporta tema claro/escuro automaticamente)
- **Axios** (browser) + **fetch** nativo (BFF, lado servidor) para chamadas HTTP
- **Docker** / **docker-compose**
- ESLint (`eslint-config-next`) + Prettier + Husky + lint-staged

## Arquitetura: BFF com Route Handlers

```
src/app/api/                          # BFF — Route Handlers do Next.js, um por recurso REST
├── _utils/relay.ts                    # Response do backend -> NextResponse (status + corpo repassados)
├── products/route.ts                  # GET  /api/products
├── coupons/route.ts                   # GET  /api/coupons
└── carts/
    ├── route.ts                       # POST /api/carts
    └── [cartId]/
        ├── route.ts                   # GET  /api/carts/:cartId
        ├── checkout/route.ts          # POST /api/carts/:cartId/checkout
        ├── coupon/route.ts            # POST + DELETE /api/carts/:cartId/coupon
        └── items/
            ├── route.ts               # POST /api/carts/:cartId/items
            └── [productId]/route.ts   # PATCH + DELETE /api/carts/:cartId/items/:productId

src/server/                           # Camada servidor, sem nenhum import de React/Next específico de rota
├── http-client.ts                     # Transporte HTTP puro: backendHttp.{get,post,patch,delete}
└── modules/                           # Um módulo por domínio, espelhando os módulos do backend
    ├── products.service.ts
    ├── coupons.service.ts
    └── cart.service.ts

src/api/<domínio>/                    # Cliente do BROWSER — chama as rotas /api/* acima (não o backend)
├── products/{methods.ts, schema.ts}
├── coupons/{methods.ts, schema.ts}
└── cart/{methods.ts, schema.ts}

src/features/<domínio>/               # Hooks de estado por funcionalidade (usam src/api/*)
├── cart/{use-cart.ts, cart-storage.ts}
└── products/use-products.ts

src/components/{atoms,molecules,organisms}/  # Componentes de apresentação (atomic design)
src/shared/                            # Utilitários (formatação de moeda, className helper)
```

Cada camada tem uma responsabilidade única:

- **`src/server/http-client.ts`** — transporte HTTP genérico para o backend (`BACKEND_API_URL`), sem saber
  nada sobre produtos/carrinho/cupom.
- **`src/server/modules/*.service.ts`** — um módulo por domínio (mesmos domínios do backend: `products`,
  `coupons`, `cart`), cada um só expõe as funções daquele recurso (`createCart`, `addItem`, `checkout`, ...).
- **`src/app/api/**/route.ts`** — os Route Handlers do Next.js (o BFF em si): adaptadores HTTP finos que leem
  os parâmetros da rota/corpo da requisição, chamam o módulo de serviço correspondente e repassam a resposta do
  backend (`_utils/relay.ts`) com o mesmo status e corpo — o mesmo formato de erro do backend chega intacto ao
  cliente.
- **`src/api/<domínio>/methods.ts`** (browser) — chama as rotas `/api/*` acima via Axios (`baseURL: '/api'`,
  mesma origem, sem CORS). Tipagem idêntica à do backend (`schema.ts`), então nada muda para quem consome esses
  métodos.
- **`src/features/<domínio>/`** — hooks (`useCart`, `useProducts`) que combinam `src/api/*` com estado local
  (`useState`/`useEffect`), sem biblioteca de estado global.
- **`src/components/`** — componentes de apresentação puros, organizados como atomic design.

**Por que BFF aqui:** o navegador nunca sabe o endereço real da API NestJS (`BACKEND_API_URL` só existe no
servidor Next.js), então não há CORS a configurar entre navegador e backend, a URL do backend pode mudar sem
tocar em código do cliente, e essa camada é o lugar natural para, no futuro, agregar chamadas, adicionar
cache/sessão ou logging — sem o cliente perceber.

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
cp .env.example .env.local   # ajuste BACKEND_API_URL se a API não estiver em localhost:3000
npm run dev
```

O app sobe em `http://localhost:3001` (ou na próxima porta livre, caso a 3000 esteja ocupada pela API).

## Rodando com Docker

```bash
BACKEND_API_URL=http://localhost:3000/v1 docker compose up --build
```

Isso sobe o frontend containerizado em `http://localhost:3001`. Como `BACKEND_API_URL` só é lida pelos Route
Handlers em tempo de requisição (nunca embutida no bundle do cliente), ela é passada como variável de ambiente
normal do container — sem precisar de build-arg.

## Variáveis de ambiente

| Variável            | Descrição                                                          | Padrão                     |
|------------------------|------------------------------------------------------------------------|--------------------------------|
| `BACKEND_API_URL`      | URL base da API do carrinho de compras (usada só pelo BFF, server-side)  | `http://localhost:3000/v1`     |

## Decisões de design e premissas assumidas

- **Padrão BFF via Route Handlers do Next.js**: em vez de um servidor Express separado (como em outras
  referências desse padrão), o próprio Next.js App Router já oferece Route Handlers server-side — é o
  equivalente idiomático a um BFF nessa stack, sem processo adicional para rodar/deployar.
- **Sem página de login/usuário**: o backend não exige autenticação, então o carrinho é tratado como um
  carrinho anônimo, identificado só pelo seu `id`, salvo no `localStorage`.
- **Uma única página**: o fluxo completo (catálogo, carrinho, cupom, totais, checkout) cabe em uma tela só, o
  que é suficiente para o escopo do teste e evita navegação desnecessária.
- **Sem biblioteca de estado global**: dado o tamanho do app, hooks por funcionalidade (`useCart`,
  `useProducts`) já cobrem a necessidade sem a complexidade extra de Redux/Zustand/React Query.
- **Mensagens de erro**: toda mensagem de erro exibida ao usuário vem diretamente do campo `message` (em
  português) devolvido pela API — o BFF só repassa a resposta do backend, sem transformar o formato de erro.
- **Tema claro/escuro**: os tokens de cor são definidos como CSS variables e reagem a
  `prefers-color-scheme`, sem exigir nenhuma configuração adicional.

## Pendências / próximos passos

- **Sem testes automatizados no frontend** — o fluxo completo foi validado manualmente no navegador (catálogo,
  adicionar/alterar/remover item, aplicar/substituir/remover cupom, checkout, bloqueio pós-checkout, erro de
  cupom inválido e de estoque insuficiente). Dado o prazo, o esforço de testes ficou concentrado no backend
  (regras de negócio); testes de componente/E2E (ex.: Playwright) e testes dos Route Handlers do BFF seriam o
  próximo passo natural.
- **Sem paginação/busca** no catálogo — só faz sentido com mais de 10 produtos.
- **Sem confirmação visual dedicada de checkout** (ex.: número do pedido) — o carrinho finalizado permanece
  visível em modo somente leitura, o que já atende ao requisito de finalizar e bloquear alterações.
