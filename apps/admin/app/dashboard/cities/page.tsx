import { createServerClient } from '@repo/lib/server';
import type { City } from '@repo/types';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@repo/ui';
import Link from 'next/link';

export const revalidate = 0; // Always fresh data

async function getCities(): Promise<City[]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching cities:', error);
        return [];
    }

    return data || [];
}

export default async function CitiesPage() {
    const cities = await getCities();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Şehir Yönetimi</h1>
                    <p className="text-muted-foreground mt-1">
                        {cities.length} şehir mevcut
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/cities/new">
                        Yeni Şehir Ekle
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tüm Şehirler</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium">Şehir Adı</th>
                                    <th className="text-left py-3 px-4 font-medium">Slug</th>
                                    <th className="text-left py-3 px-4 font-medium">Durum</th>
                                    <th className="text-left py-3 px-4 font-medium">SEO Başlık</th>
                                    <th className="text-right py-3 px-4 font-medium">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cities.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-muted-foreground">
                                            Henüz şehir eklenmemiş. Yukarıdaki butona tıklayarak ekleyin.
                                        </td>
                                    </tr>
                                ) : (
                                    cities.map((city) => (
                                        <tr key={city.id} className="border-b hover:bg-muted/50">
                                            <td className="py-3 px-4 font-medium">{city.name}</td>
                                            <td className="py-3 px-4 text-muted-foreground">
                                                {city.slug}
                                            </td>
                                            <td className="py-3 px-4">
                                                {city.is_active ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        Pasif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-muted-foreground">
                                                {city.seo_title || '-'}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link href={`/dashboard/cities/${city.id}/edit`}>
                                                            Düzenle
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <a
                                                            href={`http://localhost:3000/sehir/${city.slug}`}
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
