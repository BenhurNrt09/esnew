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

    const isVideo = (url: string) => url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) || url.includes('video');

    return (
        <div className="bg-white dark:bg-black p-4 rounded-3xl border border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-none">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
                <Maximize2 className="h-5 w-5 text-primary" /> MEDYA GALERİSİ
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img, idx) => {
                    const video = isVideo(img);
                    return (
                        <div
                            key={idx}
                            className="aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-all border border-gray-100 dark:border-white/5 relative group shadow-sm bg-gray-50 dark:bg-white/5 flex items-center justify-center ring-1 ring-gray-100 dark:ring-white/5"
                            onClick={() => openLightbox(idx)}
                        >
                            {video ? (
                                <>
                                    <video
                                        src={img}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md p-1.5 rounded-lg z-10 border border-white/10">
                                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5" />
                                    </div>
                                </>
                            ) : (
                                <img
                                    src={img}
                                    alt={`Gallery ${idx}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="eager"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 drop-shadow-lg" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Lightbox Overlay */}
            {selectedIdx !== null && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center animate-in fade-in duration-300"
                    onClick={closeLightbox}
                >
                    <button
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 sm:p-3 backdrop-blur-md transition-all z-[110] shadow-2xl"
                        onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
                    >
                        <X className="h-6 w-6 sm:h-8 sm:w-8" />
                    </button>

                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[110] bg-white/10 hover:bg-white/20 rounded-full p-4 backdrop-blur-md"
                        onClick={prevImage}
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>

                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-[110] bg-white/10 hover:bg-white/20 rounded-full p-4 backdrop-blur-md"
                        onClick={nextImage}
                    >
                        <ChevronRight className="h-8 w-8" />
                    </button>

                    <div className="w-full h-full p-4 flex items-center justify-center">
                        {isVideo(images[selectedIdx]) ? (
                            <video
                                src={images[selectedIdx]}
                                controls
                                autoPlay
                                className="w-full h-full max-h-[90vh] object-contain select-none animate-in zoom-in-95 duration-300 rounded-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <img
                                src={images[selectedIdx]}
                                alt="Full Screen"
                                className="w-full h-full max-h-[90vh] object-contain select-none animate-in zoom-in-95 duration-300 rounded-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium tracking-widest bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
                        {selectedIdx + 1} / {images.length}
                    </div>
                </div>
            )}
        </div>
    );
};
