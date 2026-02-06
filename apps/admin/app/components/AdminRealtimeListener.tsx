'use client';

import { useEffect } from 'react';
import { createBrowserClient } from '@repo/lib';
import { useToast } from '@repo/ui';
import { useRouter } from 'next/navigation';

export function AdminRealtimeListener() {
    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
        const supabase = createBrowserClient();

        // Listen for new Listings (Profiles)
        const listingsChannel = supabase.channel('admin-listings-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'listings',
                },
                (payload) => {
                    console.log('New listing:', payload);
                    toast.success('Yeni bir ilan oluşturuldu! İlanlar sayfasını kontrol edin.');
                    router.refresh();
                }
            )
            .subscribe();

        // Listen for new Members (Users)
        const membersChannel = supabase.channel('admin-members-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'members',
                },
                (payload) => {
                    console.log('New member:', payload);
                    toast.info('Yeni bir üye kayıt oldu! Üyeler sayfasını kontrol edin.');
                    router.refresh();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(listingsChannel);
            supabase.removeChannel(membersChannel);
        };
    }, [toast, router]);

    return null; // This component doesn't render anything visually
}
