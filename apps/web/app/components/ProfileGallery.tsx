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
    };

    const closeLightbox = () => {
        setSelectedIdx(null);
        document.body.style.overflow = 'auto';
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
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Maximize2 className="h-6 w-6 text-primary" /> Galeri
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className="aspect-[3/4] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-all border border-gray-100 relative group shadow-sm bg-gray-50 flex items-center justify-center"
                        onClick={() => openLightbox(idx)}
                    >
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 drop-shadow-md" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Overlay */}
            {selectedIdx !== null && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-300"
                    onClick={closeLightbox}
                >
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110]"
                        onClick={closeLightbox}
                    >
                        <X className="h-10 w-10" />
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

                    <div className="w-full h-full p-10 flex items-center justify-center">
                        <img
                            src={images[selectedIdx]}
                            alt="Full Screen"
                            className="max-w-full max-h-full object-contain select-none animate-in zoom-in-95 duration-300 shadow-2xl rounded-lg"
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
