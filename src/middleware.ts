import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ACCESS_TOKEN_COOKIE_NAME } from '@/lib/constants';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is trying to access the dashboard
  if (pathname.startsWith('/dashboard')) {
    const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME);
    // If no access token, redirect to home page
    if (!accessToken) {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }
  
  // If user is authenticated and tries to access home page, redirect to dashboard
  if (pathname === '/') {
    const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME);
    if (accessToken) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
}
