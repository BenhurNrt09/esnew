'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { createClient } from '@repo/lib/supabase/client';

interface ProfileCardProps {
    listing: any;
    isFeatured?: boolean;
    translations?: any;
}

export function ProfileCard({ listing, isFeatured, translations }: ProfileCardProps) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        const checkFavorite = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) return;

            setUser(currentUser);

            // Check if already favorited
            const { data } = await supabase
                .from('favorites')
                .select('id')
                .eq('user_id', currentUser.id)
                .eq('listing_id', listing.id)
                .single();

            setIsFavorited(!!data);
        };
        checkFavorite();
    }, [listing.id]);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            // Redirect to login
            window.location.href = '/login';
            return;
        }

        // Check if user is member
        const userType = user.user_metadata?.user_type;
        if (userType !== 'member') {
            alert('Favorilere ekleme sadece üye yetkisi ile mümkündür');
            return;
        }

        if (isFavorited) {
            // Remove from favorites
            await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('listing_id', listing.id);
            setIsFavorited(false);
        } else {
            // Add to favorites
            await supabase
                .from('favorites')
                .insert({
                    user_id: user.id,
                    listing_id: listing.id
                });
            setIsFavorited(true);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
    };

    return (
        <Link
            href={`/ilan/${listing.slug}`}
            className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-100 hover:border-primary/20 flex flex-col"
        >
            <div className="relative aspect-[3/4] overflow-hidden">
                <img
                    src={listing.cover_image || '/placeholder.jpg'}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

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
                            ? 'bg-primary text-white'
                            : 'bg-white/20 text-white hover:bg-primary hover:text-white'
                        }`}
                >
                    <Heart className={`w-4 h-4 transition-transform group-hover/heart:scale-125 ${isFavorited ? 'fill-current' : ''}`} />
                </button>

                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-sm sm:text-base md:text-lg font-black leading-tight uppercase tracking-tighter drop-shadow-md group-hover:text-primary transition-colors truncate">
                        {listing.title}
                    </h3>
                    <p className="text-white/70 text-[10px] sm:text-[11px] font-bold mt-1 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                        {listing.category?.name}
                    </p>
                </div>
            </div>

            <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1 sm:mb-2 md:mb-3">
                    <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            Başlangıç
                        </span>
                        <span className="text-primary font-black text-base sm:text-lg md:text-xl tracking-tighter">
                            {listing.pricing && listing.pricing.length > 0 ? formatPrice(listing.pricing[0].price) : 'Fiyat Belirtilmemiş'}
                        </span>
                    </div>
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary transition-colors">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
