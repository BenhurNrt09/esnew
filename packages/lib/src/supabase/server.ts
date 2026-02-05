import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = () => {
    const cookieStore = cookies();
    const appPrefix = process.env.NEXT_PUBLIC_APP_PREFIX || '';

    // Transform cookie names to add app-specific prefix
    const transformCookieName = (name: string) => {
        if (!appPrefix) return name;
        if (name.startsWith('sb-')) {
            return `${appPrefix}-${name}`;
        }
        return name;
    };

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    const transformedName = transformCookieName(name);
                    return cookieStore.get(transformedName)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        const transformedName = transformCookieName(name);
                        cookieStore.set({ name: transformedName, value, ...options });
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        const transformedName = transformCookieName(name);
                        cookieStore.set({ name: transformedName, value: '', ...options, maxAge: -1 });
                    } catch (error) {
                        // The `remove` method was called from a Server Component.
                    }
                },
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet: { name: string, value: string, options: CookieOptions }[]) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                    }
                },
            },
        }
    );
};
