import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Define public routes
    const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/register';

    // Define protected routes (dashboard, admin, vault, etc.)
    const isProtectedRoute = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/vault');

    // 1. If trying to access a protected route without a token, redirect to login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        // Keep track of where they were trying to go
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 2. If trying to access public auth pages with a token, redirect to dashboard
    if (isPublicRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/admin/:path*',
        '/vault/:path*',
        '/login',
        '/register',
    ],
};
