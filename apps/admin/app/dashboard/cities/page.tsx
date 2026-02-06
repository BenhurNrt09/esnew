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
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                        <span className="text-primary">Şehir</span> Yönetimi
                    </h1>
                    <p className="text-gray-300 mt-1 font-medium">
                        {cities.length} şehir mevcut
                    </p>
                </div>
                <Button asChild className="bg-gold-gradient text-black font-bold hover:opacity-90 rounded-lg shadow-lg shadow-primary/20">
                    <Link href="/dashboard/cities/new">
                        Yeni Şehir Ekle
                    </Link>
                </Button>
            </div>

            <Card className="bg-white/5 border-white/10 shadow-lg backdrop-blur-sm">
                <CardHeader className="bg-black/40 border-b border-white/5">
                    <CardTitle className="text-primary text-xl font-bold">Tüm Şehirler</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-black/20">
                                <tr className="border-b border-white/5">
                                    <th className="text-left py-4 px-6 font-black text-gray-400 uppercase text-[10px] tracking-widest">Şehir Adı</th>
                                    <th className="text-left py-4 px-6 font-black text-gray-400 uppercase text-[10px] tracking-widest">Slug</th>
                                    <th className="text-left py-4 px-6 font-black text-gray-400 uppercase text-[10px] tracking-widest">Durum</th>
                                    <th className="text-left py-4 px-6 font-black text-gray-400 uppercase text-[10px] tracking-widest">SEO Başlık</th>
                                    <th className="text-right py-4 px-6 font-black text-gray-400 uppercase text-[10px] tracking-widest">İşlemler</th>
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
                                        <tr key={city.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <td className="py-4 px-6 font-black text-white group-hover:text-primary transition-colors">{city.name}</td>
                                            <td className="py-4 px-6 text-primary/70 font-mono text-xs font-bold">
                                                {city.slug}
                                            </td>
                                            <td className="py-4 px-6">
                                                {city.is_active ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-green-500/10 text-green-500 border border-green-500/20">
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-gray-500/10 text-gray-500 border border-white/5">
                                                        Pasif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-400 italic font-medium">
                                                {city.seo_title || '-'}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                        className="text-primary hover:text-white hover:bg-primary/20 font-bold"
                                                    >
                                                        <Link href={`/dashboard/cities/${city.id}/edit`}>
                                                            Düzenle
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                        className="text-white hover:bg-white/10 font-bold"
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
