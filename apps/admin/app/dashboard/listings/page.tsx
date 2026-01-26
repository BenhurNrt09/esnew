import { createServerClient } from '@repo/lib';
import type { Listing, City, Category } from '@repo/types';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@repo/ui';
import Link from 'next/link';

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
    const inactiveListings = listings.filter((l) => !l.is_active);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">İlan Yönetimi</h1>
                    <p className="text-muted-foreground mt-1">
                        {activeListings.length} aktif, {inactiveListings.length} pasif ilan
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/listings/new">
                        Yeni İlan Ekle
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tüm İlanlar</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium">Başlık</th>
                                    <th className="text-left py-3 px-4 font-medium">Şehir</th>
                                    <th className="text-left py-3 px-4 font-medium">Kategori</th>
                                    <th className="text-left py-3 px-4 font-medium">Fiyat</th>
                                    <th className="text-left py-3 px-4 font-medium">Durum</th>
                                    <th className="text-right py-3 px-4 font-medium">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listings.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Henüz ilan eklenmemiş. Yukarıdaki butona tıklayarak ekleyin.
                                        </td>
                                    </tr>
                                ) : (
                                    listings.map((listing) => (
                                        <tr key={listing.id} className="border-b hover:bg-muted/50">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium line-clamp-1">{listing.title}</p>
                                                    <p className="text-xs text-muted-foreground">{listing.slug}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {listing.city?.name || '-'}
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {listing.category?.name || '-'}
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {listing.price ? (
                                                    new Intl.NumberFormat('tr-TR', {
                                                        style: 'currency',
                                                        currency: 'TRY',
                                                    }).format(listing.price)
                                                ) : '-'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    {listing.is_active ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            Pasif
                                                        </span>
                                                    )}
                                                    {listing.is_featured && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                            Öne Çıkan
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/dashboard/listings/${listing.id}/edit`}>
                                                            Düzenle
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <a
                                                            href={`http://localhost:3000/ilan/${listing.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Görüntüle
                                                        </a>
                                                    </Button>
                                                </div>
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
