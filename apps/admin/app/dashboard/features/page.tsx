import { createServerClient } from '@repo/lib/server';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@repo/ui';
import Link from 'next/link';
import { Star, ArrowRight, Sparkles, Layers } from 'lucide-react';

export const revalidate = 0;

export default async function FeaturesPage() {
    const supabase = createServerClient();

    // Verileri paralel çekelim
    const [featuredRes, categoriesRes] = await Promise.all([
        supabase.from('listings').select('*').eq('is_featured', true).order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name')
    ]);

    const featuredListings = featuredRes.data || [];
    const categories = categoriesRes.data || [];
    const parents = categories.filter(c => !c.parent_id);

    return (
        <div className="container mx-auto px-4 py-8 space-y-12">

            {/* VİTRİN YÖNETİMİ SECTION */}
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-100 pb-4">
                    <div>
                        <h1 className="text-3xl font-black text-red-950 flex items-center gap-3">
                            <Star className="h-8 w-8 text-amber-500 fill-amber-500" />
                            Vitrin & Özellikler
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Ana sayfada öne çıkan profilleri ve sistem özelliklerini buradan yönetebilirsiniz.
                        </p>
                    </div>
                    <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-200 mt-4 md:mt-0">
                        <Link href="/dashboard/listings/new">
                            <Sparkles className="mr-2 h-4 w-4" /> Vitrine Yeni Profil Ekle
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredListings.map((listing) => (
                        <div key={listing.id} className="group relative bg-white rounded-xl border border-amber-100 shadow-sm hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 overflow-hidden">
                            <div className="absolute top-3 right-3 z-10">
                                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full border border-amber-200 shadow-sm">
                                    VİTRİN
                                </span>
                            </div>
                            <div className="h-32 bg-gradient-to-br from-amber-50 to-white flex items-center justify-center p-4">
                                <div className="w-16 h-16 rounded-full bg-white border-2 border-amber-200 flex items-center justify-center text-2xl shadow-inner">
                                    {listing.title.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 truncate group-hover:text-amber-600 transition-colors">
                                    {listing.title}
                                </h3>
                                <div className="flex items-center justify-between mt-3 text-sm">
                                    <span className="text-gray-500">
                                        {listing.price ? `${listing.price} ₺` : 'Fiyat Yok'}
                                    </span>
                                    <Link href={`/dashboard/listings/${listing.id}/edit`} className="text-red-500 hover:text-red-700 font-medium text-xs flex items-center">
                                        Düzenle <ArrowRight className="h-3 w-3 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State Card */}
                    <Link href="/dashboard/listings/new" className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-amber-400 hover:bg-amber-50/30 hover:text-amber-600 transition-all cursor-pointer group h-full min-h-[180px]">
                        <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-amber-100 flex items-center justify-center mb-3 transition-colors">
                            <Star className="h-6 w-6 group-hover:fill-amber-500 transition-colors" />
                        </div>
                        <span className="font-medium text-sm">Vitrine Ekle</span>
                    </Link>
                </div>
            </div>

            {/* ÖZELLİK (KATEGORİ) LİSTESİ */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Layers className="h-5 w-5 text-red-600" />
                    <h2 className="text-xl font-bold text-gray-800">Özellik Seçenekleri</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {parents.map(parent => {
                        const subs = categories.filter(c => c.parent_id === parent.id);
                        return (
                            <Card key={parent.id} className="border-red-50 bg-white">
                                <CardHeader className="py-3 bg-red-50/30 border-b border-red-50">
                                    <CardTitle className="text-base text-red-900 flex justify-between">
                                        {parent.name}
                                        <span className="text-xs bg-white px-2 py-0.5 rounded border border-red-100 text-red-400">
                                            {subs.length}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-3 max-h-48 overflow-y-auto custom-scrollbar">
                                    <div className="flex flex-wrap gap-2">
                                        {subs.map(sub => (
                                            <span key={sub.id} className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded border border-gray-100">
                                                {sub.name}
                                            </span>
                                        ))}
                                        {subs.length === 0 && <span className="text-xs text-gray-300 italic">Seçenek yok</span>}
                                    </div>
                                    <div className="mt-4 pt-2 border-t border-gray-50">
                                        <Link href={`/dashboard/categories/${parent.id}/edit`} className="text-[10px] text-red-400 hover:text-red-600 hover:underline">
                                            + Seçenekleri Düzenle
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
