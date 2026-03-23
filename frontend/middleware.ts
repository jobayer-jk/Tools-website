import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Check if the route is a dashboard route
  const isDashboardRoute = pathname.includes('/dashboard');
  
  if (isDashboardRoute) {
    const token = req.cookies.get('jwt')?.value;
    
    // If there's no active session token, redirect to login
    if (!token) {
      // Find the locale to redirect correctly if it's in the path (e.g. /en/dashboard)
      const localeMatch = pathname.match(/^\/(en|es)/);
      const locale = localeMatch ? localeMatch[1] : 'en';
      
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  // Proceed with next-intl routing for translations and other standard routes
  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(es|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
