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
        <div className={cn("hidden lg:flex flex-col gap-3", className)}>
            {ads.map((ad) => (
                <div
                    key={ad.id}
                    className="w-full relative group overflow-hidden rounded-lg shadow-sm border border-gray-100 bg-white hover:shadow-md transition-all duration-300"
                >
                    {ad.link ? (
                        <Link href={ad.link} target="_blank" rel="follow" className="block w-full">
                            <div className="aspect-[2/3] w-full overflow-hidden bg-gray-50 flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={ad.image_url}
                                    alt="Reklam"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </Link>
                    ) : (
                        <div className="aspect-[2/3] w-full overflow-hidden bg-gray-50 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={ad.image_url}
                                alt="Reklam"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-black/50 backdrop-blur-md text-[8px] text-white px-1.5 py-0.5 rounded font-bold tracking-widest uppercase">REKLAM</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
