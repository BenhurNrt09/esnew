// Client-safe exports only
// Server-side exports -> import from '@repo/lib/server'

// Supabase client (Client-side only)
export { createClient as createBrowserClient } from './supabase/client';

// Auth helpers
export {
    validateEmail,
    validateUsername,
    validatePassword,
    validatePasswordMatch,
    checkEmailAvailability,
    checkUsernameAvailability,
    isEmail,
    rememberMe,
} from './supabase/auth-helpers';
export type { ValidationResult } from './supabase/auth-helpers';

// Utilities - safe for both client and server
export {
    slugify,
    formatPrice,
    formatDate,
    truncate,
    getPublicUrl,
} from './utils';
