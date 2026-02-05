'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
    user: (User & { displayName?: string; isAdmin?: boolean }) | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    refreshUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchUserData = async (currentUser: User) => {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('FetchUserData timeout')), 10000)
        );

        try {
            // Default values
            let userType = currentUser.user_metadata?.user_type || 'member';
            let displayName = currentUser.email?.split('@')[0] || 'Kullanıcı';

            // Parallel fetch role and potential profiles
            const fetchData = async () => {
                const results = await Promise.allSettled([
                    supabase.from('users').select('role').eq('id', currentUser.id).maybeSingle(),
                    supabase.from('members').select('username, first_name, last_name, user_type').eq('id', currentUser.id).maybeSingle(),
                    supabase.from('independent_models').select('username, full_name, user_type').eq('id', currentUser.id).maybeSingle(),
                    supabase.from('agencies').select('username, user_type').eq('id', currentUser.id).maybeSingle(),
                    supabase.from('listings').select('title').eq('user_id', currentUser.id).limit(1).maybeSingle()
                ]);

                // Log any errors for debugging
                results.forEach((res, i) => {
                    if (res.status === 'rejected') console.error(`Query ${i} failed:`, res.reason);
                });

                return results;
            };

            const results = await Promise.race([
                fetchData(),
                timeoutPromise as any
            ]);

            const [roleRes, memberRes, modelRes, agencyRes, listingRes] = results.map((r: any) =>
                r.status === 'fulfilled' ? r.value : { data: null, error: r.reason }
            );

            const isAdmin = roleRes.data?.role === 'admin';

            // Override userType and set displayName based on WHICH record we actually found
            // We search in order of priority: Model > Agency > Member
            if (modelRes.data) {
                const p = modelRes.data as any;
                userType = 'independent_model';
                if (p.full_name) displayName = p.full_name;
                else if (p.username) displayName = p.username;
                else if (listingRes.data?.title) displayName = listingRes.data.title;
            } else if (agencyRes.data) {
                userType = 'agency';
                displayName = (agencyRes.data as any).username;
            } else if (memberRes.data) {
                const p = memberRes.data as any;
                userType = 'member';
                if (p.first_name && p.last_name) displayName = `${p.first_name} ${p.last_name}`;
                else if (p.username) displayName = p.username;
            } else {
                // FALLBACK: If not found in any table, TRUST metadata first, then default
                userType = currentUser.user_metadata?.user_type || 'member';
            }

            const fullUser = { ...currentUser, displayName, isAdmin, userType };

            // Persist userType in local metadata if possible to prevent flipping
            if (typeof window !== 'undefined') {
                localStorage.setItem('lastKnownUserType', userType);
            }

            return fullUser;
        } catch (err) {
            console.error('Error fetching extended user data (using fallback):', err);
            return {
                ...currentUser,
                displayName: currentUser.email?.split('@')[0] || 'Kullanıcı',
                isAdmin: false,
                userType: currentUser.user_metadata?.user_type || 'member'
            };
        }
    };

    const refreshUser = async () => {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
            const fullUser = await fetchUserData(currentUser);
            setUser(fullUser);
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        refreshUser();

        // Safety timeout to prevent permanent loading state
        const safetyTimeout = setTimeout(() => {
            if (loading) {
                console.warn('AuthProvider safety timeout triggered');
                setLoading(false);
            }
        }, 5000);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const fullUser = await fetchUserData(session.user);
                setUser(fullUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
            clearTimeout(safetyTimeout);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}
