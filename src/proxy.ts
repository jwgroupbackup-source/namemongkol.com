import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Simple in-memory rate limiting for proxy
// Note: This is reset on server restart. For production with multiple instances, use Redis.
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfIp = request.headers.get('cf-connecting-ip');

    if (cfIp) return cfIp;
    if (forwarded) return forwarded.split(',')[0].trim();
    if (realIp) return realIp;
    return 'unknown';
}

function checkProxyRateLimit(
    key: string,
    maxRequests: number,
    windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    // Cleanup old entries periodically (1% chance per request)
    if (Math.random() < 0.01) {
        for (const [k, v] of rateLimitStore.entries()) {
            if (now > v.resetTime) rateLimitStore.delete(k);
        }
    }

    if (!entry || now > entry.resetTime) {
        rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
        return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
    }

    if (entry.count >= maxRequests) {
        return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    entry.count++;
    return { allowed: true, remaining: maxRequests - entry.count, resetTime: entry.resetTime };
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const ip = getClientIp(request);

    // Rate limit for auth API endpoints
    if (pathname.startsWith('/api/auth')) {
        const key = `proxy:auth:${ip}`;
        const { allowed, resetTime } = checkProxyRateLimit(key, 30, 60 * 1000); // 30 req/min

        if (!allowed) {
            const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
            return NextResponse.json(
                { error: 'คำขอมากเกินไป กรุณารอสักครู่', code: 'RATE_LIMITED' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': retryAfter.toString(),
                        'X-RateLimit-Remaining': '0',
                    }
                }
            );
        }
    }

    // Stricter rate limit for login endpoint specifically
    if (pathname === '/api/auth/login' && request.method === 'POST') {
        const key = `proxy:login:${ip}`;
        const { allowed, remaining } = checkProxyRateLimit(key, 10, 5 * 60 * 1000); // 10 req/5min

        if (!allowed) {
            return NextResponse.json(
                { error: 'พยายามเข้าสู่ระบบมากเกินไป กรุณารอ 5 นาที', code: 'LOGIN_RATE_LIMITED' },
                { status: 429 }
            );
        }

        // Add rate limit headers
        const response = NextResponse.next();
        response.headers.set('X-RateLimit-Remaining', remaining.toString());
        // Continue to next proxy/handler with headers
    }

    // Skip Supabase auth for public paths (faster response)
    const publicPaths = ['/', '/articles', '/search', '/about', '/terms', '/privacy', '/phone-analysis', '/name-analysis', '/premium-search', '/wallpapers', '/reviews', '/meaning', '/login', '/register', '/auth/update-password'];
    const isPublicPath = publicPaths.some(p => pathname === p || (p !== '/' && pathname.startsWith(p + '/')));
    const needsAuth = pathname.startsWith('/admin') || pathname.startsWith('/api/admin') || ['/topup', '/history', '/profile'].some(p => pathname.startsWith(p));
    if (isPublicPath && !needsAuth) {
        return NextResponse.next({ request: { headers: request.headers } });
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Protected Routes Logic
    // 1. Admin Routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Protected API Routes
    if (request.nextUrl.pathname.startsWith('/api/admin')) {
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    // 2. Protected User Routes
    const protectedPaths = ['/topup', '/history', '/profile'];
    if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};