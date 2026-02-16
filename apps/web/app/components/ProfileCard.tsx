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
                "group relative block bg-card rounded-2xl overflow-hidden border border-border transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.15)] hover:-translate-y-1.5",
                isFeatured && "premium-glow"
            )}
        >
            {/* Image Container - Premium Portrait */}
            <div className="aspect-[2.8/4] relative overflow-hidden bg-muted/30">
                <img
                    src={displayImage}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBzbGljZSI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzE4MTgxYiIvPjwvc3ZnPg==';
                    }}
                />

                {/* Shimmer Overlay for Bottom Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80" />

                {/* Top Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">

                    {listing.is_vip && (
                        <div className="bg-zinc-800 text-primary text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-lg flex items-center gap-1 border border-primary/20">
                            <Sparkles className="w-2.5 h-2.5 fill-primary" /> VIP+
                        </div>
                    )}
                    {isFeatured && (
                        <div className="bg-primary text-primary-foreground text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-lg flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-primary-foreground" /> VIP
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
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-background/40 hover:bg-background text-foreground hover:text-red-600 transition-colors backdrop-blur-sm z-20"
                >
                    <Heart className={cn("w-4 h-4", isFavorited && "fill-red-600 text-red-600")} />
                </button>

                {/* Bottom Info - Dense Layout (NO PRICE) */}
                {/* Content Section */}
                <div className="absolute bottom-0 left-0 right-0 p-1.5 md:p-2 space-y-0.5 bg-card/90 backdrop-blur-md border-t border-border/10">
                    <div className="flex flex-col gap-0">
                        <div className="flex items-center gap-1 text-primary font-bold text-[7px] md:text-[9px] italic uppercase tracking-widest">
                            <span>{listing.age_value} Yaş</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/30" />
                            <span className="truncate">{listing.city?.name}</span>
                        </div>
                        <h3 className="text-[10px] md:text-[12px] font-black text-foreground uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors line-clamp-1">
                            {listing.title}
                        </h3>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-0.5 border-t border-border/10">
                        <div className="flex items-center gap-1 text-[7.5px] font-medium text-zinc-500 uppercase tracking-widest truncate">
                            <MapPin className="w-2 h-2 text-primary/50" />
                            <span>{listing.city?.name || 'Konum'}</span>
                        </div>
                        <div className="text-[7px] font-black text-muted-foreground tracking-tighter group-hover:text-foreground transition-colors">
                            ID:{listing.id.slice(0, 4)}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
