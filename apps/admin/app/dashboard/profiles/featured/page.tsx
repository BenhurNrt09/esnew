import { createAdminClient } from '@repo/lib/server';
import type { Listing, City, Category } from '@repo/types';
import { ListingTable } from '../../listings/ListingTable';
import { Star } from 'lucide-react';

export const revalidate = 0;

async function getFeaturedListings(): Promise<(Listing & { city?: City; category?: Category })[]> {
    const supabase = createAdminClient();

    const { data: listings, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Featured Listings error:', error);
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

export default async function FeaturedProfilesPage() {
    const listings = await getFeaturedListings();
    const { cities, categories } = await getCitiesAndCategories();

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="mb-8 p-6 bg-gold-gradient rounded-3xl border-none shadow-xl shadow-amber-200/20">
                <h1 className="text-3xl font-black text-black tracking-tight flex items-center gap-3">
                    <Star className="h-8 w-8 fill-black" /> Vitrindeki Profiller
                </h1>
                <p className="text-black/70 mt-1 text-lg font-medium">
                    Şu anda vitrinde öne çıkan <span className="font-bold text-black">{listings.length}</span> özel profil bulunuyor.
                </p>
            </div>

            <ListingTable listings={listings} cities={cities} categories={categories} />
        </div>
    );
}
