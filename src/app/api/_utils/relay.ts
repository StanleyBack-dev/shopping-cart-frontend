import { NextResponse } from 'next/server';

/** Relays a backend Response's body and status code verbatim as a NextResponse. */
export async function relay(backendResponse: Response): Promise<NextResponse> {
  const body = await backendResponse.text();
  return new NextResponse(body, {
    status: backendResponse.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
