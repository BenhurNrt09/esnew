import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({ request: { headers: request.headers } });
    const appPrefix = process.env.NEXT_PUBLIC_APP_PREFIX || '';

    // Transform cookie names to add app-specific prefix
    const transformCookieName = (name: string) => {
        if (!appPrefix) return name;
        if (name.startsWith('sb-')) {
            return `${appPrefix}-${name}`;
        }
        return name;
    };

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    const transformedName = transformCookieName(name);
                    return request.cookies.get(transformedName)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    const transformedName = transformCookieName(name);
                    request.cookies.set({ name: transformedName, value, ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name: transformedName, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    const transformedName = transformCookieName(name);
                    request.cookies.set({ name: transformedName, value: '', ...options, maxAge: -1 });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name: transformedName, value: '', ...options, maxAge: -1 });
                },
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet: { name: string, value: string, options: CookieOptions }[]) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        const transformedName = transformCookieName(name);
                        request.cookies.set({
                            name: transformedName,
                            value,
                            ...options,
                        });
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        });
                        response.cookies.set({
                            name: transformedName,
                            value,
                            ...options,
                        });
                    });
                },
            },
        }
    );

    await supabase.auth.getUser();

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
