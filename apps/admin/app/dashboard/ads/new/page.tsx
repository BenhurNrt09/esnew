'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { Image as ImageIcon, Save, ArrowLeft, Loader2, Upload } from 'lucide-react';
import Link from 'next/link';

export default function NewAdPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        image_url: '',
        link: '',
        position: 'left', // 'left' | 'right'
        order: 0,
        is_active: true,
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];

        // Immediate local preview
        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);

        // 10MB limit
        if (file.size > 10 * 1024 * 1024) {
            alert('Dosya boyutu çok yüksek! Lütfen 10MB\'dan küçük bir dosya yükleyin.');
            setPreview(null);
            return;
        }

        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            console.log('Uploading file to banners bucket:', filePath);

            const { error: uploadError } = await supabase.storage
                .from('banners')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw uploadError;
            }

            const { data } = supabase.storage.from('banners').getPublicUrl(filePath);
            console.log('File uploaded, public URL:', data.publicUrl);

            setFormData({ ...formData, image_url: data.publicUrl });
            // Keep local preview if helpful, but usually public URL is better for final confirmation
            setPreview(data.publicUrl);

        } catch (error: any) {
            console.error('Full upload error context:', error);
            alert('Resim yüklenirken hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.image_url) {
                throw new Error('Lütfen bir reklam görseli yükleyin.');
            }

            const { error } = await supabase.from('banners').insert({
                image_url: formData.image_url,
                link: formData.link || null,
                position: formData.position,
                order: Number(formData.order),
                is_active: formData.is_active,
            });

            if (error) throw error;

            router.push('/dashboard/ads');
            router.refresh();

        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <Button variant="ghost" className="mb-6 pl-0 text-gray-500 hover:text-white hover:bg-transparent uppercase font-black text-xs tracking-widest gap-2" asChild>
                    <Link href="/dashboard/ads">
                        <ArrowLeft className="h-4 w-4" />
                        Geri Dön
                    </Link>
                </Button>

                <Card className="border-white/10 bg-white/5 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white/5 border-b border-white/5 py-5">
                        <CardTitle className="text-white font-black uppercase text-sm tracking-widest flex items-center gap-3">
                            <ImageIcon className="h-5 w-5 text-primary" />
                            Yeni Reklam Ekle
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-8 bg-black/20">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Image Upload Area */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <ImageIcon className="h-3 w-3 text-primary" />
                                    Reklam Görseli (Önerilen: 178x267)
                                </label>

                                <input
                                    type="file"
                                    id="ad-image-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />

                                {preview ? (
                                    <div className="relative w-full min-h-[300px] flex flex-col items-center justify-center bg-black/40 rounded-2xl border-2 border-white/10 overflow-hidden group shadow-inner">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={preview}
                                            alt="Ad Preview"
                                            className="max-w-full max-h-[500px] object-contain"
                                            onError={() => console.error('Preview load failed')}
                                        />

                                        {/* Overlay when uploading */}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
                                                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                                                <p className="text-xl font-black text-primary animate-pulse tracking-tighter uppercase italic">YÜKLENİYOR...</p>
                                            </div>
                                        )}

                                        {/* Hover Controls */}
                                        {!uploading && (
                                            <div className="absolute bottom-4 right-4 flex gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => document.getElementById('ad-image-upload')?.click()}
                                                    className="bg-black/60 text-white hover:bg-black border-white/10 shadow-2xl font-black uppercase text-[10px] tracking-widest px-4 h-9 rounded-lg"
                                                >
                                                    Değiştir
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setPreview(null);
                                                        setFormData({ ...formData, image_url: '' });
                                                    }}
                                                    className="font-black text-[10px] uppercase tracking-widest text-red-500 hover:text-red-400 hover:bg-black/40"
                                                >
                                                    Kaldır
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        className="w-full py-20 flex flex-col items-center justify-center border-4 border-dashed border-white/10 rounded-3xl bg-black/20 hover:bg-white/5 hover:border-primary/50 transition-all cursor-pointer group"
                                        onClick={() => document.getElementById('ad-image-upload')?.click()}
                                    >
                                        <div className="bg-white/5 p-6 rounded-full mb-6 shadow-2xl border border-white/5 group-hover:scale-110 transition-transform duration-500">
                                            {uploading ? (
                                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                            ) : (
                                                <Upload className="h-12 w-12 text-gray-500 group-hover:text-primary transition-colors" />
                                            )}
                                        </div>
                                        <div className="text-center px-4">
                                            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Görsel Seçmek İçin Tıklayın</h3>
                                            <p className="text-gray-400 font-medium max-w-sm mx-auto italic">
                                                Reklam görselini buraya sürükleyebilir veya dosyalarınız arasından seçebilirsiniz.
                                                <br />
                                                <span className="text-primary not-italic mt-1 inline-block">Önerilen ölçek: 178x267 piksel</span>
                                            </p>
                                        </div>
                                        <div className="mt-8 px-8 py-4 bg-gold-gradient text-black rounded-xl font-black shadow-lg shadow-primary/20 group-hover:opacity-90 transition-all uppercase tracking-widest text-xs">
                                            Bilgisayardan Gözat
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Position */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Görüntülenecek Taraf</label>
                                    <select
                                        className="w-full h-12 px-4 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer font-bold outline-none"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    >
                                        <option value="left" className="bg-zinc-900">Sol Taraf (Sidebar)</option>
                                        <option value="right" className="bg-zinc-900">Sağ Taraf (Sidebar)</option>
                                    </select>
                                </div>

                                {/* Order */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sıralama Önceliği</label>
                                    <Input
                                        type="number"
                                        className="bg-black/40 border-white/10 focus:border-primary h-12 shadow-xl font-black text-white rounded-xl pl-4"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                                        min={0}
                                    />
                                </div>
                            </div>

                            {/* Link */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Save className="h-3 w-3 text-primary" />
                                    Tıklayınca Gidilecek Link (Opsiyonel)
                                </label>
                                <Input
                                    placeholder="https://"
                                    className="bg-black/40 border-white/10 focus:border-primary h-12 shadow-xl font-bold text-white rounded-xl pl-4 placeholder:italic placeholder:text-gray-600"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                />
                            </div>

                            {/* Is Active */}
                            <div className="flex items-center justify-between p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                                <div className="space-y-1">
                                    <label className="text-lg font-black text-white uppercase tracking-tight">Reklam Yayında</label>
                                    <p className="text-sm text-gray-400 font-medium italic">Bu reklamı dilediğiniz zaman duraklatabilirsiniz.</p>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-8 w-8 rounded-xl border-white/10 bg-black/40 text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer shadow-xl"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-16 bg-gold-gradient hover:opacity-90 text-black font-black text-xl transition-all shadow-2xl shadow-primary/30 active:scale-[0.98] rounded-xl uppercase tracking-tighter"
                                disabled={loading || uploading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-3 h-7 w-7 animate-spin" />
                                        REKLAM KAYDEDİLİYOR...
                                    </>
                                ) : (
                                    'REKLAMI SİSTEME KAYDET'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
