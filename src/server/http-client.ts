/**
 * Low-level HTTP transport used by the server-side domain modules
 * (src/server/modules/**) to reach the real shopping-cart-backend API.
 *
 * `BACKEND_API_URL` is intentionally not prefixed with `NEXT_PUBLIC_`, so it's
 * never bundled into client JS — the browser only ever talks to this Next.js
 * server's own /api routes (the BFF layer), never to the backend directly.
 *
 * Every method resolves with the raw backend `Response` (not parsed JSON) so
 * the route handlers can relay the backend's status code and body verbatim,
 * preserving its error contract without this layer having to know its shape.
 */
const BACKEND_API_URL = process.env.BACKEND_API_URL ?? 'http://localhost:3000/v1';

function request(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${BACKEND_API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
    cache: 'no-store',
  });
}

export const backendHttp = {
  get: (path: string): Promise<Response> => request(path),

  post: (path: string, body?: unknown): Promise<Response> =>
    request(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),

  patch: (path: string, body?: unknown): Promise<Response> =>
    request(path, { method: 'PATCH', body: body === undefined ? undefined : JSON.stringify(body) }),

  delete: (path: string): Promise<Response> => request(path, { method: 'DELETE' }),
};
