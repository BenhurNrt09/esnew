'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Heart, ArrowRight, Sparkles, Star } from 'lucide-react';
import { createClient } from '@repo/lib/supabase/client';
import { cn } from "@repo/ui/src/lib/utils";

interface ProfileCardProps {
    listing: any;
    isFeatured?: boolean;
    translations?: any;
}

export function ProfileCard({ listing, isFeatured, translations }: ProfileCardProps) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const checkFavorite = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) return;

            setUser(currentUser);

            // Check if already favorited with a more robust query
            const { data, error } = await supabase
                .from('favorites')
                .select('id')
                .eq('user_id', currentUser.id)
                .eq('listing_id', listing.id)
                .maybeSingle();

            if (data) setIsFavorited(true);
        };
        checkFavorite();
    }, [listing.id]);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            router.push('/login');
            return;
        }

        // Check if user is member (support both user_type and role fallbacks)
        const userType = user.user_metadata?.user_type || user.user_metadata?.role;
        if (userType !== 'member' && userType !== 'user') {
            alert('Favorilere ekleme sadece üye yetkisi ile mümkündür. Mevcut rolünüz: ' + (userType || 'Tanımsız'));
            return;
        }

        if (isFavorited) {
            setIsFavorited(false);
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('listing_id', listing.id);

            if (error) {
                setIsFavorited(true);
                console.error('Favorite remove error:', error);
            }
        } else {
            setIsFavorited(true);
            const { error } = await supabase
                .from('favorites')
                .insert({
                    user_id: user.id,
                    listing_id: listing.id
                });

            if (error) {
                setIsFavorited(false);
                if (error.code === '42703') {
                    alert('Veritabanı hatası: Sütun bulunamadı. Lütfen SQL güncellemelerini yapın.');
                } else {
                    alert('Favori eklenirken bir hata oluştu: ' + error.message);
                }
            }
        }
    };

    const formatPrice = (prices: any[]) => {
        if (!prices || prices.length === 0) return null;
        const validPrices = prices.map(p => p.price || p.incall_price).filter(p => p != null);
        if (validPrices.length === 0) return null;
        const minPrice = Math.min(...validPrices);
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(minPrice);
    };

    const displayPrice = formatPrice(listing.model_pricing) || (listing.price ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(listing.price) : 'Fiyat Belirtilmemiş');

    return (
        <Link
            href={`/ilan/${listing.slug}`}
            className={cn(
                "group block bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100 hover:border-primary/20 flex flex-col h-full",
                isFeatured && "ring-2 ring-primary/20 shadow-primary/5"
            )}
        >
            <div className="relative aspect-[3/4] overflow-hidden">
                <img
                    src={listing.cover_image || (listing.images && listing.images[0]) || '/placeholder.jpg'}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {isFeatured && (
                        <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg flex items-center gap-1 animate-pulse">
                            <Sparkles className="w-3 h-3" /> VİTRİN
                        </span>
                    )}
                    <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" /> {listing.city?.name}
                    </span>
                </div>

                <button
                    onClick={toggleFavorite}
                    className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg group/heart ${isFavorited
                        ? 'bg-primary text-white scale-110'
                        : 'bg-white/20 text-white hover:bg-primary hover:text-white'
                        }`}
                >
                    <Heart className={`w-4 h-4 transition-transform group-hover/heart:scale-125 ${isFavorited ? 'fill-current' : ''}`} />
                </button>

                <div className="absolute bottom-4 left-4 right-4">
                    {/* Rating Badge below cover photo */}
                    <div className="flex justify-center mb-3">
                        <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-xl transition-transform hover:scale-110">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-white text-[11px] font-black tracking-tight">
                                5.0
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                            {listing.category?.name}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col flex-1 bg-white">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-primary font-black uppercase tracking-[0.2em] leading-none mb-1">
                        PROSİTEL PROFİLİ
                    </span>
                    <div className="flex items-center justify-between group/title">
                        <h3 className="text-gray-900 text-lg sm:text-xl font-black leading-tight uppercase tracking-tighter transition-colors group-hover/title:text-primary">
                            {listing.title}
                        </h3>
                        <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary transition-all shadow-inner group-hover:rotate-45">
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
