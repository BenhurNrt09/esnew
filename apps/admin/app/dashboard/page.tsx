import { requireAdmin, createServerClient } from '@repo/lib/server';
import { redirect } from 'next/navigation';
import { DashboardContent } from './DashboardContent';

export const revalidate = 0;

async function getData() {
    const supabase = createServerClient();

    const [listingsRes, citiesRes, categoriesRes, usersRes, recentRes] = await Promise.all([
        supabase.from('listings').select('id, is_active, is_featured'),
        supabase.from('cities').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('listings').select('title, created_at, is_active').order('created_at', { ascending: false }).limit(5)
    ]);

    const totalListings = listingsRes.data?.length || 0;
    const activeListings = listingsRes.data?.filter(l => l.is_active).length || 0;
    const featuredListings = listingsRes.data?.filter(l => l.is_featured).length || 0;

    return {
        stats: {
            totalListings,
            activeListings,
            featuredListings,
            totalCities: citiesRes.count || 0,
            totalCategories: categoriesRes.count || 0,
            totalUsers: usersRes.count || 0
        },
        recentActivity: recentRes.data || []
    };
}

export default async function DashboardPage() {
    try {
        await requireAdmin();
    } catch {
        redirect('/login');
    }

    const { stats, recentActivity } = await getData();

    return <DashboardContent stats={stats} recentActivity={recentActivity} />;
}
