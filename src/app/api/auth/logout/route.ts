import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ACCESS_TOKEN_COOKIE_NAME, ACCESS_TOKEN_SECRET_COOKIE_NAME } from '@/lib/constants';

export async function GET() {
  const cookieStore = cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE_NAME);
  cookieStore.delete(ACCESS_TOKEN_SECRET_COOKIE_NAME);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '/';
  return NextResponse.redirect(new URL('/', appUrl).toString());
}
