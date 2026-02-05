import { createAdminClient } from '@repo/lib/server';
import type { Listing, City, Category } from '@repo/types';
import { ListingTable } from '../../../listings/ListingTable';
import { Building2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

async function getAgencyDetails(id: string) {
    const supabase = createAdminClient();
    const { data: agency } = await supabase.from('agencies').select('*').eq('id', id).single();
    return agency;
}

async function getAgencyListings(agencyId: string): Promise<(Listing & { city?: City; category?: Category })[]> {
    const supabase = createAdminClient();

    const { data: listings, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', agencyId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Agency Listings error:', error);
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

export default async function AgencyProfilesDetailPage({ params }: { params: { id: string } }) {
    const agency = await getAgencyDetails(params.id);
    const listings = await getAgencyListings(params.id);
    const { cities, categories } = await getCitiesAndCategories();

    if (!agency) return <div>Ajans bulunamadı.</div>;

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <Link
                href="/dashboard/profiles/agencies"
                className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest mb-8 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Ajans Listesine Dön
            </Link>

            <div className="mb-12 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary shadow-xl shadow-primary/10 border border-primary/20">
                        <Building2 className="h-10 w-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                            {agency.company_name || agency.username}
                        </h1>
                        <p className="text-gray-400 mt-2 font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            Ajanstaki toplam kayıt sayısı: <span className="text-gray-900 font-black">{listings.length}</span>
                        </p>
                    </div>
                </div>
            </div>

            <ListingTable listings={listings} cities={cities} categories={categories} />
        </div>
    );
}
