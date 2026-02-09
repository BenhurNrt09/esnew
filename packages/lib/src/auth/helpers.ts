import { createClient } from '../supabase/server';
import type { User } from '@repo/types';

export async function getCurrentUser(): Promise<User | null> {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Get user data from database
    const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

    // If user doesn't exist in database, create them
    if (!data) {
        // Double check auth metadata for admin role
        const isAdmin = user.app_metadata?.role === 'admin' ||
            user.user_metadata?.role === 'admin' ||
            user.user_metadata?.user_type === 'admin';

        const { data: newUser } = await supabase
            .from('users')
            .insert({
                id: user.id,
                email: user.email,
                role: isAdmin ? 'admin' : 'user'
            })
            .select()
            .single();
        return newUser;
    }

    return data;
}

export async function requireAuth(): Promise<User> {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    return user;
}

export async function requireAdmin(): Promise<User> {
    const user = await requireAuth();

    if (user.role !== 'admin') {
        throw new Error('Forbidden: Admin access required');
    }

    return user;
}

export async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
}
