// Server-side only exports
// Use: import { createServerClient } from '@repo/lib/server'

export { createClient as createServerClient } from './supabase/server';
export { createAdminClient } from './supabase/admin';

export {
    getCurrentUser,
    requireAuth,
    requireAdmin,
    signOut,
} from './auth/helpers';
