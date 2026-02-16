'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Crown, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from "@repo/ui/src/lib/utils";
import Link from 'next/link';
import type { Listing } from '@repo/types';

type ExtendedListing = Listing & {
    is_premium?: boolean;
    is_vip?: boolean;
    age_value?: number;
};

interface StackedListingCardProps {
    listing: ExtendedListing;
    index?: number;
}

export function StackedListingCard({ listing, index = 0 }: StackedListingCardProps) {
    const isPremium = listing.is_premium;
    const isVip = (listing.is_vip || (listing as any).is_featured) && !listing.is_premium;
    const isNormal = !isPremium && !isVip;

    const images = useMemo(() => {
        const all: string[] = [];
        if (listing.cover_image) all.push(listing.cover_image);
        if (listing.images && Array.isArray(listing.images)) {
            listing.images.forEach(img => {
                if (img && typeof img === 'string' && img !== listing.cover_image) {
                    all.push(img);
                }
            });
        }
        return all.length > 0 ? all : ['https://placehold.co/800x600/1a1a1a/D4AF37.png?text=No+Image'];
    }, [listing.cover_image, listing.images]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
                "group relative w-full h-[95px] md:h-[105px] bg-card rounded-xl border transition-all duration-300 flex",
                isPremium ? "premium-glow-extreme animate-border-shimmer border-transparent bg-primary/5" : "border-border overflow-hidden",
                isVip && "border-border/60 overflow-hidden"
            )}
        >
            {/* LEFT SECTION (Compact Info) */}
            <div
                className="w-[100px] md:w-[190px] h-full p-2 md:p-3 flex flex-col justify-center border-r border-border bg-card/95 relative z-10 group-hover:bg-muted/40 transition-colors overflow-hidden"
            >
                <Link
                    href={`/ilan/${listing.slug}`}
                    className="absolute inset-0 z-20"
                />
                <div className="relative z-10 space-y-0.5 md:space-y-1">


                    <h3 className="text-[9px] md:text-[13px] font-black text-foreground uppercase tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-1">
                        {listing.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-primary font-bold text-[7px] md:text-[10px] uppercase tracking-wider">
                        <span>{listing.age_value} Yaş</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-border" />
                        <span>{listing.city?.name}</span>
                    </div>

                    <div className="text-[5px] md:text-[7px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-0.5">
                        ID: {listing.id.slice(0, 4).toUpperCase()}
                    </div>
                </div>
            </div>

            {/* RIGHT SECTION (Gallery Marquee) */}
            <div className="flex-1 h-full relative overflow-hidden bg-background flex items-center">
                {(isPremium || isVip) && images.length > 0 && !images[0].includes('placehold.co') ? (
                    <div className="w-full h-full relative overflow-hidden">
                        <motion.div
                            className="flex h-full items-center absolute left-0"
                            animate={{
                                x: images.length > 1 ? ["0%", "-25%"] : 0
                            }}
                            transition={{
                                duration: Math.max(images.length * 12, 45), // Slower for premium feel
                                ease: "linear",
                                repeat: Infinity
                            }}
                            style={{ width: 'fit-content' }}
                        >
                            {/* 4 sets of images for absolute safety against gaps */}
                            {[...images, ...images, ...images, ...images].map((img, i) => (
                                <div key={i} className="h-full w-[90px] md:w-[135px] flex-shrink-0 border-r border-border/10 overflow-hidden bg-muted/40">
                                    <img
                                        src={img}
                                        alt={`${listing.title}-${i}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                ) : (
                    <div className="w-full h-full relative flex items-center justify-center bg-[radial-gradient(circle_at_center,_#18181b_0%,_#000_100%)]">
                        <img
                            src={listing.cover_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop'}
                            alt="Placeholder"
                            className="w-full h-full object-cover opacity-20 grayscale"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                            <Sparkles className="w-5 h-5 text-zinc-800 animate-pulse" />
                            <span className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.3em]">Görsel Hazırlanıyor</span>
                        </div>
                    </div>
                )}
                {/* Subtle Overlays */}
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-zinc-950 via-zinc-950/60 to-transparent z-10 pointer-events-none" />
            </div>
        </motion.div>
    );
}

function ImageWithSkeleton({ src, alt, className }: { src: string; alt: string; className?: string }) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={cn("relative overflow-hidden bg-muted", className)}>
            {!isLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border border-border/50" />
                </div>
            )}
            <img
                src={src}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                className={cn(
                    "w-full h-full object-cover transition-opacity duration-1000",
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
            />
        </div>
    );
}
