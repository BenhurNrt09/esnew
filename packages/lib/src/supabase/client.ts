import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
    const isBrowser = typeof window !== 'undefined';

    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    if (!isBrowser) return undefined;
                    const cookie = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
                    return cookie ? decodeURIComponent(cookie.split('=')[1]) : undefined;
                },
                set(name: string, value: string, options: any) {
                    if (!isBrowser) return;
                    let cookieString = `${name}=${encodeURIComponent(value)}`;
                    if (options?.maxAge) cookieString += `; Max-Age=${options.maxAge}`;
                    if (options?.path) cookieString += `; Path=${options.path}`;
                    if (options?.domain) cookieString += `; Domain=${options.domain}`;
                    if (options?.secure) cookieString += `; Secure`;
                    if (options?.sameSite) cookieString += `; SameSite=${options.sameSite}`;
                    document.cookie = cookieString;
                },
                remove(name: string, options: any) {
                    if (!isBrowser) return;
                    document.cookie = `${name}=; Max-Age=-1; Path=${options?.path || '/'}`;
                },
                getAll() {
                    if (!isBrowser) return [];
                    return document.cookie.split('; ').filter(Boolean).map(str => {
                        const [name, ...value] = str.split('=');
                        return { name, value: decodeURIComponent(value.join('=')) };
                    });
                },
                setAll(cookiesToSet: any[]) {
                    if (!isBrowser) return;
                    cookiesToSet.forEach(({ name, value, options }) => {
                        this.set(name, value, options);
                    });
                },
            },
            cookieOptions: {
                name: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'sb-auth-token',
            },
            auth: {
                storageKey: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME ? `${process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME}-storage` : undefined,
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
            }
        }
    );
};
