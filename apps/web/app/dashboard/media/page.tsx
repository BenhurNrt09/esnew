'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, useToast } from '@repo/ui';
import {
    Camera, Image as ImageIcon, Video,
    Plus, Trash2, LayoutGrid, Sparkles,
    UploadCloud, CheckCircle2, AlertCircle
} from 'lucide-react';
import { getPublicUrl } from '@repo/lib';

export default function MediaPage() {
    const toast = useToast();
    const supabase = createClient();
    const searchParams = useSearchParams();
    const urlListingId = searchParams.get('listingId');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [listing, setListing] = useState<any>(null);
    const [stories, setStories] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get listing
        let query = supabase
            .from('listings')
            .select('*');

        if (urlListingId) {
            query = query.eq('id', urlListingId);
        } else {
            query = query.eq('user_id', user.id);
        }

        const { data: listingData } = await query.limit(1).maybeSingle();

        if (listingData) {
            setListing(listingData);
        }

        if (listingData) {
            setListing(listingData);

            // Get stories using LISTING ID
            const { data: storiesData } = await supabase
                .from('stories')
                .select('*')
                .eq('listing_id', listingData.id)
                .order('created_at', { ascending: false });

            if (storiesData) setStories(storiesData);
        }
        setLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'story') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Oturum bulunamadı.');

            for (const file of Array.from(files)) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}/${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('listings')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const publicUrl = getPublicUrl('listings', fileName);

                if (type === 'photo') {
                    // Add to listing images
                    const newImages = [...(listing.images || []), publicUrl];
                    const updateData: any = { images: newImages };

                    // If no cover_image exists, set the first one as cover
                    if (!listing.cover_image) {
                        updateData.cover_image = publicUrl;
                    }

                    const { error: updateError } = await supabase
                        .from('listings')
                        .update(updateData)
                        .eq('id', listing.id);
                    if (updateError) throw updateError;
                    setListing({ ...listing, ...updateData });
                } else {
                    // Add to stories
                    if (!listing?.id) throw new Error('İlan bulunamadı. Lütfen önce profilinizi oluşturun.');

                    const { error: storyError } = await supabase
                        .from('stories')
                        .insert({
                            listing_id: listing.id,
                            model_id: user.id, // Keep model_id for backward compat / FK if needed
                            media_url: publicUrl,
                            media_type: file.type.startsWith('video') ? 'video' : 'image',
                        });
                    if (storyError) throw storyError;
                }
            }

            toast.success('Yükleme başarılı!');
            loadData();
        } catch (err: any) {
            toast.error('Hata: ' + (err.message || 'Yüklenemedi.'));
        } finally {
            setUploading(false);
        }
    };

    const deleteImage = async (url: string) => {
        try {
            const newImages = listing.images.filter((img: string) => img !== url);
            const updateData: any = { images: newImages };

            // If the deleted image is the cover image, clear it or set to next available
            if (listing.cover_image === url) {
                updateData.cover_image = newImages.length > 0 ? newImages[0] : null;
            }

            const { error } = await supabase
                .from('listings')
                .update(updateData)
                .eq('id', listing.id);

            if (error) throw error;
            setListing({ ...listing, ...updateData });
            toast.success('Fotoğraf silindi.');
        } catch (err: any) {
            toast.error('Hata: ' + err.message);
        }
    };

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Medya & Hikayeler</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Fotoğraf ve videolarınızı yönetin, hikayeler paylaşın.</p>
            </div>

            {/* Stories Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold uppercase tracking-tight flex items-center gap-1.5 text-gray-900 dark:text-white">
                        <Sparkles className="w-4 h-4 text-primary" /> Hikayelerim
                    </h2>
                    <div className="relative">
                        <input
                            type="file"
                            id="story-upload"
                            className="hidden"
                            accept="image/*,video/*"
                            onChange={(e) => handleFileUpload(e, 'story')}
                            disabled={uploading}
                        />
                        <label
                            htmlFor="story-upload"
                            className="flex items-center gap-1.5 px-4 h-9 bg-primary text-white rounded-lg font-bold text-xs tracking-tight cursor-pointer hover:scale-105 transition-all shadow-md shadow-primary/20"
                        >
                            <Plus className="w-3.5 h-3.5" /> YENİ HİKAYE EKLE
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                    {stories.map((story) => (
                        <div key={story.id} className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/5 group">
                            {story.media_type === 'video' ? (
                                <video src={story.media_url} className="w-full h-full object-cover" />
                            ) : (
                                <img src={story.media_url} className="w-full h-full object-cover" alt="Story" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                                <span className="text-[10px] text-white font-bold uppercase tracking-widest truncate">
                                    {new Date(story.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                    {stories.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-400 dark:text-gray-600 font-bold border-2 border-dashed border-gray-100 dark:border-white/10 rounded-3xl bg-gray-50/50 dark:bg-white/[0.02]">
                            Henüz hikaye paylaşmadınız.
                        </div>
                    )}
                </div>
            </section>

            {/* Photos Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold uppercase tracking-tight flex items-center gap-1.5 text-gray-900 dark:text-white">
                        <LayoutGrid className="w-4 h-4 text-gray-400 dark:text-gray-600" /> Galeri (Fotoğraf & Video)
                    </h2>
                    <div className="relative">
                        <input
                            type="file"
                            id="photo-upload"
                            className="hidden"
                            multiple
                            accept="image/*,video/*"
                            onChange={(e) => handleFileUpload(e, 'photo')}
                            disabled={uploading}
                        />
                        <label
                            htmlFor="photo-upload"
                            className="flex items-center gap-1.5 px-4 h-9 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-xs tracking-tight cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm"
                        >
                            <UploadCloud className="w-3.5 h-3.5" /> FOTOĞRAF YÜKLE
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {listing?.images?.map((img: string, idx: number) => {
                        const isVideo = img.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) || img.includes('video');
                        return (
                            <div key={idx} className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/5 group shadow-sm hover:shadow-xl transition-all">
                                {isVideo ? (
                                    <video src={img} className="w-full h-full object-cover" />
                                ) : (
                                    <img src={img} className="w-full h-full object-cover" alt={`Media ${idx}`} />
                                )}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => deleteImage(img)}
                                        className="p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                {idx === 0 && (
                                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full text-[10px] font-black text-primary border border-primary/20 uppercase tracking-tighter">
                                        Kapak Fotoğrafı
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {(!listing?.images || listing.images.length === 0) && (
                        <div className="col-span-full py-20 text-center text-gray-400 dark:text-gray-600 font-bold border-2 border-dashed border-gray-100 dark:border-white/10 rounded-3xl bg-gray-50/50 dark:bg-white/[0.02]">
                            Hiç fotoğraf yüklenmemiş.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
