import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Only protect /portal routes
  if (!pathname.startsWith('/portal')) {
    return NextResponse.next();
  }

  // Check for auth cookie (we'll set this on login)
  const authCookie = req.cookies.get('cysmf_auth');

  // If no auth cookie, redirect to auth page
  if (!authCookie) {
    const url = new URL('/auth', req.url);
    url.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*'],
};
