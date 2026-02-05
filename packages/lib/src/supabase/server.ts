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
                getAll() {
                    return cookieStore.getAll().map((cookie) => ({
                        name: cookie.name.replace(`${appPrefix}-`, ''),
                        value: cookie.value,
                    }));
                },
                setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            const transformedName = transformCookieName(name);
                            cookieStore.set(transformedName, value, options);
                        });
                    } catch {
                        // The `setAll` method was called from a Server Component.
                    }
                },
            },
        }
    );
};
