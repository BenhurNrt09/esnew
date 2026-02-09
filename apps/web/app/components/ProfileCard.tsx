'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Heart, Star, ShieldCheck, Crown, Sparkles } from 'lucide-react';
import { createClient } from '@repo/lib/supabase/client';
import { cn } from "@repo/ui/src/lib/utils";

interface ProfileCardProps {
    listing: any;
    isFeatured?: boolean;
    translations?: any;
}

export function ProfileCard({ listing, isFeatured }: ProfileCardProps) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();

    // Check if user is logged in and if this listing is already favorited
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setUserId(user.id);

            // Check if favorite exists (composite PK, no id column)
            const { data, error } = await supabase
                .from('favorites')
                .select('user_id')
                .eq('user_id', user.id)
                .eq('listing_id', listing.id)
                .maybeSingle();

            if (data && !error) {
                setIsFavorited(true);
            }
        };
        checkFavoriteStatus();
    }, [listing.id]);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!userId) {
            // User not logged in, redirect to login
            router.push('/login');
            return;
        }

        // Optimistic update
        setIsFavorited(!isFavorited);

        if (isFavorited) {
            // Remove from favorites using composite key
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', userId)
                .eq('listing_id', listing.id);

            if (error) {
                console.error('Error removing favorite:', error);
                setIsFavorited(true); // Revert optimistic update
            }
        } else {
            // Add to favorites
            const { error } = await supabase
                .from('favorites')
                .insert({ user_id: userId, listing_id: listing.id });

            if (error) {
                console.error('Error adding favorite:', error);
                setIsFavorited(false); // Revert optimistic update
            }
        }
    };

    const isVideo = (url: string) => url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) || url.includes('video');

    const displayImage = useMemo(() => {
        if (listing.cover_image && !isVideo(listing.cover_image)) return listing.cover_image;
        if (listing.images && Array.isArray(listing.images)) {
            const firstImage = listing.images.find((img: string) => !isVideo(img));
            if (firstImage) return firstImage;
        }
        return 'https://placehold.co/400x600/1a1a1a/D4AF37.png?text=No+Image';
    }, [listing.cover_image, listing.images]);

    return (
        <Link
            href={`/ilan/${listing.slug}`}
            className={cn(
                "group relative block bg-card rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                isFeatured ? "border-2 border-primary/50" : "border border-border/50"
            )}
        >
            {/* Image Container - Strictly Portrait */}
            <div className="aspect-[4/5] relative overflow-hidden bg-muted">
                <img
                    src={displayImage}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBzbGljZSI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzE4MTgxYiIvPjwvc3ZnPg==';
                    }}
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                {/* Top Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                    {listing.is_premium && (
                        <div className="bg-gold-gradient text-black text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-lg flex items-center gap-1 border border-black/10">
                            <Crown className="w-2.5 h-2.5 fill-black" /> PREMIUM
                        </div>
                    )}
                    {listing.is_vip && (
                        <div className="bg-zinc-800 text-primary text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-lg flex items-center gap-1 border border-primary/20">
                            <Sparkles className="w-2.5 h-2.5 fill-primary" /> VIP+
                        </div>
                    )}
                    {isFeatured && (
                        <div className="bg-primary text-black text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-lg flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-black" /> VIP
                        </div>
                    )}
                    {listing.is_verified && (
                        <div className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-lg flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5" /> ONAYLI
                        </div>
                    )}
                </div>

                {/* Favorite Button */}
                <button
                    onClick={toggleFavorite}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 hover:bg-white text-white hover:text-red-600 transition-colors backdrop-blur-sm z-20"
                >
                    <Heart className={cn("w-4 h-4", isFavorited && "fill-red-600 text-red-600")} />
                </button>

                {/* Bottom Info - Dense Layout (NO PRICE) */}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-10 text-white">
                    <div className="flex items-end justify-between mb-1">
                        <h3 className={cn(
                            "font-black capitalize tracking-tight leading-none truncate pr-2",
                            isFeatured ? "text-lg text-primary" : "text-base text-white group-hover:text-primary transition-colors"
                        )}>
                            {listing.title}
                        </h3>
                        {listing.age_value && (
                            <span className="text-xs font-bold bg-white/20 px-1.5 py-0.5 rounded backdrop-blur-md">
                                {listing.age_value}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-medium text-gray-300">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-primary" />
                                <span className="uppercase tracking-wider">{listing.city?.name}</span>
                            </div>
                        </div>
                        {listing.rating_average > 0 && (
                            <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-md">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-[10px] font-bold text-white">{Number(listing.rating_average).toFixed(1)}</span>
                                <span className="text-[9px] text-gray-400">({listing.review_count})</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
