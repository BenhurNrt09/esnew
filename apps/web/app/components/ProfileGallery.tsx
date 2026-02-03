'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@repo/ui';

interface ProfileGalleryProps {
    images: string[];
}

export const ProfileGallery = ({ images }: ProfileGalleryProps) => {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    const openLightbox = (index: number) => {
        setSelectedIdx(index);
        document.body.style.overflow = 'hidden';
        document.documentElement.classList.add('lightbox-open');
    };

    const closeLightbox = () => {
        setSelectedIdx(null);
        document.body.style.overflow = 'auto';
        document.documentElement.classList.remove('lightbox-open');
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIdx === null) return;
        setSelectedIdx((selectedIdx + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIdx === null) return;
        setSelectedIdx((selectedIdx - 1 + images.length) % images.length);
    };

    if (images.length === 0) return null;

    return (
        <div className="bg-white rounded-xl p-3 shadow-md border border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                <Maximize2 className="h-3.5 w-3.5 text-primary" /> Galeri
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className="aspect-[3/4] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-all border border-gray-100 relative group shadow-sm bg-gray-50 flex items-center justify-center"
                        onClick={() => openLightbox(idx)}
                    >
                        <img
                            src={img}
                            alt={`Gallery ${idx}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="eager"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 drop-shadow-lg" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Overlay */}
            {selectedIdx !== null && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center animate-in fade-in duration-300"
                    onClick={closeLightbox}
                >
                    <button
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 sm:p-3 backdrop-blur-md transition-all z-[110] shadow-2xl"
                        onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
                    >
                        <X className="h-6 w-6 sm:h-8 sm:w-8" />
                    </button>

                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[110] bg-white/10 hover:bg-white/20 rounded-full p-4 backdrop-blur-md"
                        onClick={nextImage}
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>

                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[110] bg-white/10 hover:bg-white/20 rounded-full p-4 backdrop-blur-md"
                        onClick={prevImage}
                    >
                        <ChevronRight className="h-8 w-8" />
                    </button>

                    <div className="w-full h-full p-4 flex items-center justify-center">
                        <img
                            src={images[selectedIdx]}
                            alt="Full Screen"
                            className="w-full h-full object-contain select-none animate-in zoom-in-95 duration-300 rounded-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium tracking-widest bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
                        {selectedIdx + 1} / {images.length}
                    </div>
                </div>
            )}
        </div>
    );
};
