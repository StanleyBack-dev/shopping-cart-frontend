import axios, { isAxiosError } from 'axios';

/**
 * The browser only ever calls this Next.js app's own BFF routes (src/app/api/**),
 * never the real backend directly — same origin, no CORS, and the backend's
 * address stays server-only (see src/server/http-client.ts).
 */
export const apiHttp = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

/** Shape returned by the backend's global exception filter for every treated error. */
interface ApiErrorBody {
  success: false;
  code: string;
  message: string;
  timestamp: string;
  path: string;
}

const FALLBACK_ERROR_MESSAGE = 'Não foi possível concluir a operação. Tente novamente.';

export function getApiErrorMessage(error: unknown, fallback = FALLBACK_ERROR_MESSAGE): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
}

export function getApiErrorCode(error: unknown): string | undefined {
  if (isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.code;
  }

  return undefined;
}
