'use client';

import { useState, useEffect } from 'react';
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
        const { data: listingData } = await supabase
            .from('listings')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (listingData) {
            setListing(listingData);
        }

        if (listingData) {
            setListing(listingData);

            // Get stories using listing ID
            const { data: storiesData } = await supabase
                .from('stories')
                .select('*')
                .eq('model_id', listingData.id)
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
                            model_id: listing.id,
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
            const { error } = await supabase
                .from('listings')
                .update({ images: newImages })
                .eq('id', listing.id);
            if (error) throw error;
            setListing({ ...listing, images: newImages });
            toast.success('Fotoğraf silindi.');
        } catch (err: any) {
            toast.error('Hata: ' + err.message);
        }
    };

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Medya & Hikayeler</h1>
                <p className="text-gray-500 font-medium">Fotoğraflarınızı yönetin ve 24 saatlik hikayeler paylaşın.</p>
            </div>

            {/* Stories Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" /> Hikayelerim
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
                            className="flex items-center gap-2 px-6 h-11 bg-primary text-white rounded-xl font-bold text-sm tracking-tight cursor-pointer hover:scale-105 transition-all shadow-lg shadow-primary/20"
                        >
                            <Plus className="w-4 h-4" /> YENİ HİKAYE EKLE
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {stories.map((story) => (
                        <div key={story.id} className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 group">
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
                        <div className="col-span-full py-12 text-center text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-3xl">
                            Henüz hikaye paylaşmadınız.
                        </div>
                    )}
                </div>
            </section>

            {/* Photos Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5 text-gray-400" /> Profil Fotoğrafları
                    </h2>
                    <div className="relative">
                        <input
                            type="file"
                            id="photo-upload"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'photo')}
                            disabled={uploading}
                        />
                        <label
                            htmlFor="photo-upload"
                            className="flex items-center gap-2 px-6 h-11 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm tracking-tight cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <UploadCloud className="w-4 h-4" /> FOTOĞRAF YÜKLE
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {listing?.images?.map((img: string, idx: number) => (
                        <div key={idx} className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 group shadow-sm hover:shadow-xl transition-all">
                            <img src={img} className="w-full h-full object-cover" alt={`Photo ${idx}`} />
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => deleteImage(img)}
                                    className="p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            {idx === 0 && (
                                <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-primary border border-primary/20 uppercase tracking-tighter">
                                    Kapak Fotoğrafı
                                </div>
                            )}
                        </div>
                    ))}
                    {(!listing?.images || listing.images.length === 0) && (
                        <div className="col-span-full py-20 text-center text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                            Hiç fotoğraf yüklenmemiş.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
