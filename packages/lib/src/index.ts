// Client-safe exports only
// Server-side exports -> import from '@repo/lib/server'

// Supabase client (Client-side only)
export { createClient as createBrowserClient } from './supabase/client';

// Utilities - safe for both client and server
export {
    slugify,
    formatPrice,
    formatDate,
    truncate,
    getPublicUrl,
} from './utils';
