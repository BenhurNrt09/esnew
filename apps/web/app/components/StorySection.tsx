'use client';

import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import type { Listing } from '@repo/types';

interface StorySectionProps {
    listings: Listing[];
}

export function StorySection({ listings }: StorySectionProps) {
    if (!listings || listings.length === 0) return null;

    return (
        <div className="w-full overflow-hidden py-3 border-b border-border/40 bg-background/50">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar pb-1">
                    {listings.map((listing, i) => (
                        <motion.div
                            key={listing.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
                        >
                            <div className="relative">
                                {/* Glow and Image Ring */}
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-primary/50 p-0.5 bg-zinc-950 relative overflow-hidden ring-4 ring-primary/10">
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                        <img
                                            src={listing.cover_image || ''}
                                            alt={listing.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                </div>

                            </div>

                            <span className="text-[8px] md:text-[9px] font-bold text-zinc-500 group-hover:text-primary transition-colors truncate w-14 md:w-16 text-center uppercase tracking-wider">
                                {listing.title.split(' ')[0]}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
