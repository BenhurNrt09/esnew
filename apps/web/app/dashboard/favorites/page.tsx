'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { Heart, Trash2, ExternalLink, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
    const supabase = createClient();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const loadFavorites = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setUserId(user.id);

            const { data } = await supabase
                .from('favorites')
                .select(`
                    user_id,
                    listing_id,
                    created_at,
                    listing:listings(
                        id,
                        title,
                        slug,
                        cover_image,
                        is_featured,
                        city:cities(name),
                        category:categories(name),
                        model_pricing(*)
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            setFavorites(data || []);
            setLoading(false);
        };
        loadFavorites();
    }, []);

    const removeFavorite = async (listingId: string) => {
        if (!userId) return;
        await supabase.from('favorites').delete()
            .eq('user_id', userId)
            .eq('listing_id', listingId);
        setFavorites(favorites.filter(f => f.listing_id !== listingId));
    };

    const formatPrice = (pricing: any[]) => {
        if (!pricing || pricing.length === 0) return 'Fiyat Belirtilmemiş';
        const prices = pricing.map((p: any) => p.incall_price || p.price).filter(p => p != null);
        if (prices.length === 0) return 'Fiyat Belirtilmemiş';
        const minPrice = Math.min(...prices);
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(minPrice);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                    <Heart className="w-8 h-8 text-primary fill-current" />
                    Favorilerim
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                    Beğendiğiniz profilleri buradan takip edebilirsiniz
                </p>
            </div>

            {favorites.length === 0 ? (
                <Card className="shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden bg-white dark:bg-[#0a0a0a]">
                    <CardContent className="p-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">
                            Henüz favori eklemediniz
                        </h3>
                        <p className="text-gray-400 dark:text-gray-500 font-medium mb-6">
                            Beğendiğiniz profilleri favorilere ekleyerek buradan kolayca ulaşabilirsiniz
                        </p>
                        <Link href="/">
                            <button className="h-12 px-8 rounded-xl bg-primary text-white font-bold uppercase tracking-wide hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                Profilleri Keşfet
                            </button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {favorites.map((favorite) => (
                        <Card key={favorite.listing_id} className="shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/5 bg-white dark:bg-[#0a0a0a] rounded-xl overflow-hidden hover:shadow-xl transition-all group">
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <img
                                    src={favorite.listing.cover_image || 'https://placehold.co/400x600/1a1a1a/D4AF37.png?text=No+Image'}
                                    alt={favorite.listing.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                                {favorite.listing.is_featured && (
                                    <span className="absolute top-2 left-2 bg-primary text-black text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter shadow-lg flex items-center gap-0.5">
                                        <Sparkles className="w-2 h-2" /> VİTRİN
                                    </span>
                                )}

                                <button
                                    onClick={() => removeFavorite(favorite.listing_id)}
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white hover:bg-red-600 transition-all backdrop-blur-sm z-20"
                                    title="Favorilerden Çıkar"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>

                                <div className="absolute bottom-2 left-2 right-2">
                                    <h3 className="text-white text-xs font-black leading-tight uppercase tracking-tighter truncate">
                                        {favorite.listing.title}
                                    </h3>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <MapPin className="w-2 h-2 text-primary" />
                                        <p className="text-white/70 text-[8px] font-bold uppercase truncate">
                                            {favorite.listing.city?.name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-2 bg-gray-50/50 dark:bg-white/5">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-primary font-black text-xs tracking-tighter truncate">
                                        {formatPrice(favorite.listing.model_pricing)}
                                    </p>
                                    <Link href={`/ilan/${favorite.listing.slug}`}>
                                        <button className="h-7 px-2 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white font-black text-[9px] uppercase tracking-widest transition-all border border-primary/20 flex items-center gap-1 shrink-0">
                                            GİT
                                            <ExternalLink className="w-2 w-2" />
                                        </button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
