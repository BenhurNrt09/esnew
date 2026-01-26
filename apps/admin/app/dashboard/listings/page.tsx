import { createServerClient } from '@repo/lib/server';
import type { Listing, City, Category } from '@repo/types';
import { Button } from '@repo/ui';
import Link from 'next/link';
import { ListingTable } from './ListingTable';
import { UserPlus } from 'lucide-react';

export const revalidate = 0;

async function getListings(): Promise<(Listing & { city?: City; category?: Category })[]> {
    const supabase = createServerClient();

    const { data: listings, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Listings error:', error);
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
    const supabase = createServerClient();
    const [citiesRes, catsRes] = await Promise.all([
        supabase.from('cities').select('*').order('name'),
        supabase.from('categories').select('*').order('name')
    ]);
    return {
        cities: citiesRes.data || [],
        categories: catsRes.data || []
    }
}

export default async function ListingsPage() {
    const listings = await getListings();
    const { cities, categories } = await getCitiesAndCategories();

    // Quick stats
    const total = listings.length;
    const active = listings.filter(l => l.is_active).length;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-red-950">İlan Yönetimi</h1>
                    <p className="text-muted-foreground mt-1">
                        Toplam <span className="font-bold text-red-600">{total}</span> ilan,
                        <span className="font-bold text-green-600 ml-1">{active}</span> aktif yayında
                    </p>
                </div>
                <Button asChild className="gap-2 bg-red-600 hover:bg-red-700 text-white rounded-full px-6 shadow-red-200 shadow-lg">
                    <Link href="/dashboard/listings/new">
                        <UserPlus className="h-4 w-4" /> Yeni İlan Ekle
                    </Link>
                </Button>
            </div>

            <ListingTable listings={listings} cities={cities} categories={categories} />
        </div>
    );
}
