import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
    const isBrowser = typeof window !== 'undefined';
    const appPrefix = process.env.NEXT_PUBLIC_APP_PREFIX || '';

    // Transform cookie names to add app-specific prefix
    const transformCookieName = (name: string) => {
        if (!appPrefix) return name;
        // If it's a Supabase cookie, prefix it with app name
        if (name.startsWith('sb-')) {
            return `${appPrefix}-${name}`;
        }
        return name;
    };

    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    if (!isBrowser) return undefined;
                    const transformedName = transformCookieName(name);
                    const cookie = document.cookie.split('; ').find(row => row.startsWith(`${transformedName}=`));
                    return cookie ? decodeURIComponent(cookie.split('=')[1]) : undefined;
                },
                set(name: string, value: string, options: any) {
                    if (!isBrowser) return;
                    const transformedName = transformCookieName(name);
                    let cookieString = `${transformedName}=${encodeURIComponent(value)}`;
                    if (options?.maxAge) cookieString += `; Max-Age=${options.maxAge}`;
                    if (options?.path) cookieString += `; Path=${options.path}`;
                    if (options?.domain) cookieString += `; Domain=${options.domain}`;
                    if (options?.secure) cookieString += `; Secure`;
                    if (options?.sameSite) cookieString += `; SameSite=${options.sameSite}`;
                    document.cookie = cookieString;
                },
                remove(name: string, options: any) {
                    if (!isBrowser) return;
                    const transformedName = transformCookieName(name);
                    document.cookie = `${transformedName}=; Max-Age=-1; Path=${options?.path || '/'}`;
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
        }
    );
};
