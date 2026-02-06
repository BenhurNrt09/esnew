import { createServerClient } from '@repo/lib/server';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@repo/ui';
import Link from 'next/link';
import { Image as ImageIcon, Plus, ExternalLink, Trash2, Edit } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const revalidate = 0;

async function getAds() {
    const supabase = createServerClient();
    const { data: ads, error } = await supabase
        .from('banners')
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
            <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                        <ImageIcon className="h-8 w-8 text-primary" />
                        Reklam <span className="text-primary italic">Yönetimi</span>
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium">
                        Sitede görünen reklam alanlarını yönetin
                    </p>
                </div>
                <Button asChild className="bg-gold-gradient hover:opacity-90 text-black font-black uppercase tracking-tight rounded-xl shadow-lg shadow-primary/20 px-6 h-12 gap-2">
                    <Link href="/dashboard/ads/new">
                        <Plus className="h-5 w-5" />
                        Yeni Reklam Ekle
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ads.map((ad) => (
                    <Card key={ad.id} className="overflow-hidden border-white/10 bg-white/5 shadow-2xl group hover:border-primary/30 transition-all backdrop-blur-sm rounded-2xl">
                        <div className="w-full bg-black/40 relative overflow-hidden border-b border-white/5 flex items-center justify-center p-4 min-h-[200px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={ad.image_url}
                                alt="Reklam"
                                className="max-w-full h-auto max-h-48 shadow-2xl rounded-lg group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                                <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase shadow-lg border border-white/10 ${ad.position === 'left' ? 'bg-blue-600/80 text-white' : 'bg-purple-600/80 text-white'
                                    }`}>
                                    {ad.position === 'left' ? 'SOL' : 'SAĞ'}
                                </span>
                                <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase shadow-lg border border-white/10 ${ad.is_active ? 'bg-green-600/80 text-white' : 'bg-zinc-600/80 text-white'
                                    }`}>
                                    {ad.is_active ? 'AKTİF' : 'PASİF'}
                                </span>
                            </div>
                            <div className="absolute bottom-3 left-3">
                                <span className="bg-black/80 text-primary border border-white/10 px-3 py-1 rounded-lg text-[10px] font-mono font-black backdrop-blur-md">
                                    SIRA: {ad.order}
                                </span>
                            </div>
                        </div>
                        <CardContent className="p-5 bg-black/20">
                            {ad.link && (
                                <a
                                    href={ad.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-primary/70 hover:text-primary font-black uppercase tracking-widest flex items-center gap-2 mb-5 truncate italic"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    {ad.link}
                                </a>
                            )}
                            {!ad.link && <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-5 italic">Link Tanımsız</p>}

                            <div className="flex items-center gap-3">
                                <Button variant="outline" size="sm" className="flex-1 gap-2 border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-gold-gradient hover:text-black hover:border-transparent rounded-xl h-10" asChild>
                                    <Link href={`/dashboard/ads/${ad.id}/edit`}>
                                        <Edit className="h-3 w-3" /> Düzenle
                                    </Link>
                                </Button>
                                {/* Delete button would ideally be a client component or form action */}
                                <form action={async () => {
                                    'use server';
                                    const supabase = createServerClient();
                                    await supabase.from('banners').delete().eq('id', ad.id);
                                    revalidatePath('/dashboard/ads');
                                }}>
                                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500 transition-colors h-10 w-10">
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {ads.length === 0 && (
                    <div className="col-span-full py-24 text-center border-2 border-dashed border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                        <ImageIcon className="h-16 w-16 text-white/10 mx-auto mb-6" />
                        <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Henüz reklam yok</h3>
                        <p className="text-gray-400 font-medium mb-8">İlk reklamınızı ekleyerek başlayın.</p>
                        <Button asChild className="bg-gold-gradient text-black font-black uppercase tracking-widest h-12 px-8 rounded-xl shadow-lg shadow-primary/20">
                            <Link href="/dashboard/ads/new">Reklam Ekle</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
