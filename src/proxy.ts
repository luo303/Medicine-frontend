import { NextRequest, NextResponse } from 'next/server';
import {
    AUTH_TOKEN_COOKIE_NAME,
    HOME_ROUTE,
    LOGIN_ROUTE,
    REGISTER_ROUTE,
} from '@/features/auth/lib/auth-constants';

const PUBLIC_ROUTES = new Set([LOGIN_ROUTE, REGISTER_ROUTE]);

export default function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const token = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;
    const isAuthenticated = Boolean(token);
    const isAuthRoute = PUBLIC_ROUTES.has(pathname);
    const isRootRoute = pathname === '/';

    if (isAuthenticated && (isAuthRoute || isRootRoute)) {
        return NextResponse.redirect(new URL(HOME_ROUTE, request.url));
    }

    if (!isAuthenticated && !isAuthRoute) {
        const loginUrl = new URL(LOGIN_ROUTE, request.url);

        if (!isRootRoute) {
            loginUrl.searchParams.set('next', `${pathname}${search}`);
        }

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};
