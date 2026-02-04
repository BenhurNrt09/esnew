import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables');
    }


    // During SSR (build time), we need to provide dummy cookie methods to prevent crashes.
    // In the browser, we let createBrowserClient handle document.cookie automatically by NOT passing the cookies object.
    const isBrowser = () => typeof window !== 'undefined';

    const options: any = {
        cookieOptions: {
            name: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME,
        },
    };

    if (!isBrowser()) {
        options.cookies = {
            getAll() { return []; },
            setAll() { }
        };
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey, options);
};
