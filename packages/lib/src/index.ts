// Supabase clients - client-side only
export { createClient as createBrowserClient } from './supabase/client';

// Utilities - safe for both client and server
export {
    slugify,
    formatPrice,
    formatDate,
    truncate,
    getPublicUrl,
} from './utils';

