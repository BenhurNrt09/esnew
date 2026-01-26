import { createClient } from './server';
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
        .single();

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
