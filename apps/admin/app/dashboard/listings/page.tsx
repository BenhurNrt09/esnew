import { createServerClient } from '@repo/lib/server';
import type { Listing, City, Category } from '@repo/types';
import { Button } from '@repo/ui';
import Link from 'next/link';
import { ListingTable } from './ListingTable';
import { UserPlus, Users } from 'lucide-react';

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
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Users className="h-8 w-8 text-primary" /> Profil Yönetimi
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Toplam <span className="font-bold text-primary">{total}</span> profil,
                        <span className="font-bold text-green-600 ml-1">{active}</span> aktif yayında
                    </p>
                </div>
                <Button asChild className="h-12 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-black font-bold rounded-xl px-8 shadow-lg shadow-primary/10 transition-all hover:scale-105 active:scale-95">
                    <Link href="/dashboard/listings/new">
                        <UserPlus className="h-5 w-5" /> Yeni Profil Oluştur
                    </Link>
                </Button>
            </div>

            <ListingTable listings={listings} cities={cities} categories={categories} />
        </div>
    );
}
