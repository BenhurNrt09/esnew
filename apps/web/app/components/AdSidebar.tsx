import React from 'react';
import Link from 'next/link';
import { cn } from '@repo/ui';

interface Ad {
    id: string;
    image_url: string;
    link: string | null;
    position: string;
    order: number;
}

interface AdSidebarProps {
    qs?: any; // removed position prop as we filter outside or pass filtered ads
    ads: Ad[];
    className?: string;
}

export const AdSidebar = ({ ads, className }: AdSidebarProps) => {
    if (ads.length === 0) return null;

    return (
        <div className={cn("flex flex-col gap-4 py-4", className)}>
            {ads.map((ad) => (
                <div
                    key={ad.id}
                    className="w-full aspect-square relative group overflow-hidden rounded-lg shadow-sm border border-gray-100 bg-white"
                >
                    {ad.link ? (
                        <Link href={ad.link} target="_blank" rel="follow">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={ad.image_url}
                                alt="Reklam"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </Link>
                    ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={ad.image_url}
                            alt="Reklam"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            ))}
        </div>
    );
};
