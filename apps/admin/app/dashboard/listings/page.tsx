import { createServerClient } from '@repo/lib/server';
import type { Listing, City, Category } from '@repo/types';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@repo/ui';
import Link from 'next/link';
import { ListingActions } from './ListingActions';
import { Search, UserPlus } from 'lucide-react';

export const revalidate = 0;

async function getListings(): Promise<(Listing & { city?: City; category?: Category })[]> {
    const supabase = createServerClient();

    const { data: listings, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching listings:', error);
        return [];
    }

    if (!listings) return [];

    // Get cities and categories
    const { data: cities } = await supabase.from('cities').select('*');
    const { data: categories } = await supabase.from('categories').select('*');

    // Combine data
    return listings.map((listing) => ({
        ...listing,
        city: cities?.find((c) => c.id === listing.city_id),
        category: categories?.find((c) => c.id === listing.category_id),
    }));
}

export default async function ListingsPage() {
    const listings = await getListings();
    const activeListings = listings.filter((l) => l.is_active);
    const featuredListings = listings.filter((l) => l.is_featured);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Profil Yönetimi</h1>
                    <p className="text-muted-foreground mt-1">
                        Toplam {listings.length} profil ({activeListings.length} aktif, {featuredListings.length} vitrin)
                    </p>
                </div>
                <Button asChild className="gap-2">
                    <Link href="/dashboard/listings/new">
                        <UserPlus className="h-4 w-4" /> Yeni Profil Ekle
                    </Link>
                </Button>
            </div>

            <Card className="border-none shadow-md">
                <CardHeader className="border-b bg-muted/40">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Tüm Profiller</CardTitle>
                        {/* Search could go here */}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/40 text-xs uppercase">
                                <tr>
                                    <th className="text-left py-4 px-6 font-medium text-muted-foreground">Profil</th>
                                    <th className="text-left py-4 px-6 font-medium text-muted-foreground">Konum</th>
                                    <th className="text-left py-4 px-6 font-medium text-muted-foreground">Kategori</th>
                                    <th className="text-left py-4 px-6 font-medium text-muted-foreground">Fiyat</th>
                                    <th className="text-left py-4 px-6 font-medium text-muted-foreground">Durum</th>
                                    <th className="text-right py-4 px-6 font-medium text-muted-foreground">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {listings.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                            Henüz profil bulunmuyor.
                                        </td>
                                    </tr>
                                ) : (
                                    listings.map((listing) => (
                                        <tr key={listing.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                                                        {listing.title.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-foreground">{listing.title}</p>
                                                        <p className="text-xs text-muted-foreground font-mono">{listing.id.slice(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                    {listing.city?.name || '-'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                                    {listing.category?.name || '-'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm font-medium">
                                                {listing.price ? (
                                                    new Intl.NumberFormat('tr-TR', {
                                                        style: 'currency',
                                                        currency: 'TRY',
                                                    }).format(listing.price)
                                                ) : <span className="text-muted-foreground text-xs">Görüşülür</span>}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    {listing.is_active ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                                            <span className="text-xs font-medium text-green-700">Yayında</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="h-2 w-2 rounded-full bg-slate-300" />
                                                            <span className="text-xs font-medium text-slate-500">Taslak/Pasif</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <ListingActions
                                                    id={listing.id}
                                                    slug={listing.slug}
                                                    isActive={listing.is_active}
                                                    isFeatured={listing.is_featured}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
