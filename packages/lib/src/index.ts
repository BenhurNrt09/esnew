// Supabase clients
export { createClient as createBrowserClient } from './supabase/client';
export { createClient as createServerClient } from './supabase/server';
export { createAdminClient } from './supabase/admin';

// Auth helpers  
export {
    getCurrentUser,
    requireAuth,
    requireAdmin,
    signOut,
} from './auth/helpers';

// Utilities - safe for both client and server
export {
    slugify,
    formatPrice,
    formatDate,
    truncate,
    getPublicUrl,
} from './utils';
