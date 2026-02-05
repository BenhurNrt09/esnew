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
                getAll() {
                    if (!isBrowser) return [];
                    const allCookies = document.cookie.split('; ').filter(Boolean).map(str => {
                        const [name, ...value] = str.split('=');
                        return { name, value: decodeURIComponent(value.join('=')) };
                    });

                    if (!appPrefix) return allCookies;

                    // Filter and transform
                    return allCookies
                        .filter(c => c.name.startsWith(`${appPrefix}-`) || !c.name.startsWith('sb-'))
                        .map(c => ({
                            name: c.name.replace(`${appPrefix}-`, ''),
                            value: c.value
                        }));
                },
                setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
                    if (!isBrowser) return;
                    cookiesToSet.forEach(({ name, value, options }) => {
                        const transformedName = transformCookieName(name);
                        let cookieString = `${transformedName}=${encodeURIComponent(value)}`;
                        if (options?.maxAge) cookieString += `; Max-Age=${options.maxAge}`;
                        if (options?.path) cookieString += `; Path=${options.path}`;
                        if (options?.domain) cookieString += `; Domain=${options.domain}`;
                        if (options?.secure) cookieString += `; Secure`;
                        if (options?.sameSite) cookieString += `; SameSite=${options.sameSite}`;
                        document.cookie = cookieString;
                    });
                },
            },
        }
    );
};
