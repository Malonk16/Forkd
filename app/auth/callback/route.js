// auth callback route handler
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    return NextResponse.redirect(`${origin}/?code=${code}`);
  }

  return NextResponse.redirect(`${origin}/`);
}