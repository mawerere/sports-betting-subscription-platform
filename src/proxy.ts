import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

export async function proxy(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  
  const path = request.nextUrl.pathname;
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/admin') || path.startsWith('/predictions');
  const isAdminRoute = path.startsWith('/admin');
  const isPublicRoute = path === '/login' || path === '/register';

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session) {
    try {
      const decrypted = await decrypt(session);
      
      if (isPublicRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      if (isAdminRoute && decrypted.user.role !== 'SUPERADMIN' && decrypted.user.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      // Invalid session
      if (isProtectedRoute) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.set('session', '', { expires: new Date(0) });
        return response;
      }
      const response = NextResponse.next();
      response.cookies.set('session', '', { expires: new Date(0) });
      return response;
    }
  }

  return NextResponse.next();
}

// Export as default to guarantee Next.js proxy resolution
export default proxy;

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/predictions/:path*',
    '/login',
    '/register',
  ],
};