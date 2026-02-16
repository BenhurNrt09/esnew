'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ProfileCard } from './ProfileCard';
import type { Listing } from '@repo/types';

interface HeroCarouselProps {
    listings: Listing[];
}

export function HeroCarousel({ listings }: HeroCarouselProps) {
    // Duplicate listings to create a seamless loop
    const duplicatedListings = [...listings, ...listings, ...listings];

    return (
        <div className="relative w-full overflow-hidden bg-background py-8 border-b border-border/50">


            {/* Marquee Container */}
            <div className="flex select-none relative z-10">
                <motion.div
                    className="flex gap-4 px-4"
                    animate={{
                        x: ['0%', '-33.33%'],
                    }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30, // Adjust speed here
                        repeatType: "loop"
                    }}
                    whileHover={{ animationPlayState: 'paused' }} // Optional: pause on hover if we use CSS animation, but for framer motion we need a different approach or just let it flow. 
                // To actually pause on hover with framer-motion requires useAnimation controls, keeping it simple for now.
                >
                    {duplicatedListings.map((listing, index) => (
                        <div
                            key={`${listing.id}-${index}`}
                            className="w-[280px] flex-shrink-0 transform transition-transform duration-300 hover:scale-105"
                        >
                            <ProfileCard listing={listing} />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Gradient Overlays for smooth edges */}
            <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />
        </div>
    );
}
