import { createServerClient } from '@repo/lib/server';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@repo/ui';
import Link from 'next/link';
import { Image as ImageIcon, Plus, ExternalLink, Trash2, Edit } from 'lucide-react';

export const revalidate = 0;

async function getAds() {
    const supabase = createServerClient();
    const { data: ads, error } = await supabase
        .from('ads')
        .select('*')
        .order('order', { ascending: true });

    if (error) {
        console.error('Error fetching ads:', error);
        return [];
    }
    return ads || [];
}

export default async function AdsPage() {
    const ads = await getAds();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-red-950 flex items-center gap-3">
                        <ImageIcon className="h-8 w-8 text-red-600" />
                        Reklam Yönetimi
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Sitede görünen reklam alanlarını yönetin
                    </p>
                </div>
                <Button asChild className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-red-200 gap-2">
                    <Link href="/dashboard/ads/new">
                        <Plus className="h-4 w-4" />
                        Yeni Reklam Ekle
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ads.map((ad) => (
                    <Card key={ad.id} className="overflow-hidden border-red-100 shadow-sm group hover:shadow-md transition-shadow">
                        <div className="aspect-[1/1] bg-gray-100 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={ad.image_url}
                                alt="Reklam"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm ${ad.position === 'left' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                                    }`}>
                                    {ad.position === 'left' ? 'SOL' : 'SAĞ'}
                                </span>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm ${ad.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                                    }`}>
                                    {ad.is_active ? 'AKTİF' : 'PASİF'}
                                </span>
                            </div>
                            <div className="absolute bottom-2 left-2">
                                <span className="bg-black/50 text-white px-2 py-1 rounded text-xs font-mono font-bold backdrop-blur-sm">
                                    Sıra: {ad.order}
                                </span>
                            </div>
                        </div>
                        <CardContent className="p-4">
                            {ad.link && (
                                <a
                                    href={ad.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 mb-4 truncate"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    {ad.link}
                                </a>
                            )}
                            {!ad.link && <p className="text-xs text-gray-400 italic mb-4">Link yok</p>}

                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="flex-1 gap-1 text-red-600 hover:bg-red-50" asChild>
                                    <Link href={`/dashboard/ads/${ad.id}/edit`}>
                                        <Edit className="h-3 w-3" /> Düzenle
                                    </Link>
                                </Button>
                                {/* Delete button would ideally be a client component or form action */}
                                <form action={async () => {
                                    'use server';
                                    const supabase = createServerClient();
                                    await supabase.from('ads').delete().eq('id', ad.id);
                                    // revalidate path not needed as page is revalidate = 0, but good practice
                                }}>
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {ads.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">Henüz reklam yok</h3>
                        <p className="text-gray-500 text-sm mb-4">İlk reklamınızı ekleyerek başlayın.</p>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/ads/new">Reklam Ekle</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
