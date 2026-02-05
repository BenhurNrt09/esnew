import { createAdminClient } from '@repo/lib/server';
import type { Listing, City, Category } from '@repo/types';
import { ListingTable } from '../../listings/ListingTable';
import { Users } from 'lucide-react';

export const revalidate = 0;

async function getPendingListings(): Promise<(Listing & { city?: City; category?: Category })[]> {
    const supabase = createAdminClient();

    const { data: listings, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_active', false)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Pending Listings error:', error);
        return [];
    }
    if (!listings) return [];

    const { data: cities } = await supabase.from('cities').select('*');
    const { data: categories } = await supabase.from('categories').select('*');

    return listings.map((listing) => ({
        ...listing,
        city: cities?.find((c) => c.id === listing.city_id),
        category: categories?.find((c) => c.id === listing.category_id),
    }));
}

async function getCitiesAndCategories() {
    const supabase = createAdminClient();
    const [citiesRes, catsRes] = await Promise.all([
        supabase.from('cities').select('*').order('name'),
        supabase.from('categories').select('*').order('name')
    ]);
    return {
        cities: citiesRes.data || [],
        categories: catsRes.data || []
    }
}

export default async function PendingProfilesPage() {
    const listings = await getPendingListings();
    const { cities, categories } = await getCitiesAndCategories();

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3 italic">
                    <Users className="h-8 w-8 text-amber-500" /> Onay Bekleyenler
                </h1>
                <p className="text-muted-foreground mt-1 text-lg">
                    Şu anda onay bekleyen <span className="font-bold text-amber-600">{listings.length}</span> profil bulunuyor.
                </p>
            </div>

            <ListingTable listings={listings} cities={cities} categories={categories} />
        </div>
    );
}
