'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { Image as ImageIcon, ArrowLeft, Loader2, Upload } from 'lucide-react';
import Link from 'next/link';

export default function EditAdPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        image_url: '',
        link: '',
        position: 'left', // 'left' | 'right'
        order: 0,
        is_active: true,
    });

    useEffect(() => {
        const fetchAd = async () => {
            const { data, error } = await supabase
                .from('banners')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error) {
                alert('Reklam bulunamadı: ' + error.message);
                router.push('/dashboard/ads');
                return;
            }

            setFormData({
                image_url: data.image_url,
                link: data.link || '',
                position: data.position || 'left',
                order: data.order || 0,
                is_active: data.is_active,
            });
            setPreview(data.image_url);
            setLoading(false);
        };

        fetchAd();
    }, [params.id, router, supabase]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];

        // Immediate local preview
        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);

        // 10MB limit
        if (file.size > 10 * 1024 * 1024) {
            alert('Dosya boyutu çok yüksek! Lütfen 10MB\'dan küçük bir dosya yükleyin.');
            // Revert preview to existing image if possible
            setPreview(formData.image_url);
            return;
        }

        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            console.log('Editing ad: Uploading file to banners bucket:', filePath);

            const { error: uploadError } = await supabase.storage
                .from('banners')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Edit upload error:', uploadError);
                throw uploadError;
            }

            const { data } = supabase.storage.from('banners').getPublicUrl(filePath);
            console.log('File uploaded during edit, public URL:', data.publicUrl);

            setFormData({ ...formData, image_url: data.publicUrl });
            setPreview(data.publicUrl);

        } catch (error: any) {
            console.error('Full edit upload error context:', error);
            alert('Resim yüklenirken hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
            setPreview(formData.image_url);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (!formData.image_url) {
                throw new Error('Lütfen bir reklam görseli yükleyin.');
            }

            const { error } = await supabase
                .from('banners')
                .update({
                    image_url: formData.image_url,
                    link: formData.link || null,
                    position: formData.position,
                    order: Number(formData.order),
                    is_active: formData.is_active,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', params.id);

            if (error) throw error;

            router.push('/dashboard/ads');
            router.refresh();

        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-red-600 text-gray-500" asChild>
                    <Link href="/dashboard/ads">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri Dön
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center gap-3">
                            <ImageIcon className="h-6 w-6 text-red-600" />
                            Reklamı Düzenle
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Image Upload Area */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-red-600" />
                                    Reklam Görseli
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
                                    <div className="relative w-full min-h-[300px] flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-gray-100 overflow-hidden group">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={preview}
                                            alt="Ad Preview"
                                            className="max-w-full max-h-[500px] object-contain"
                                            onError={() => console.error('Preview load failed')}
                                        />

                                        {/* Overlay when uploading */}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-20">
                                                <Loader2 className="h-12 w-12 animate-spin text-red-600 mb-4" />
                                                <p className="text-xl font-black text-red-900 animate-pulse">YÜKLENİYOR...</p>
                                            </div>
                                        )}

                                        {/* Controls */}
                                        {!uploading && (
                                            <div className="absolute bottom-4 right-4 flex gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => document.getElementById('ad-image-upload')?.click()}
                                                    className="bg-white text-black hover:bg-gray-100 border shadow-md font-bold"
                                                >
                                                    Görseli Değiştir
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        className="w-full py-20 flex flex-col items-center justify-center border-4 border-dashed border-red-200 rounded-3xl bg-white hover:bg-red-50/50 hover:border-red-400 transition-all cursor-pointer group"
                                        onClick={() => document.getElementById('ad-image-upload')?.click()}
                                    >
                                        <div className="bg-red-50 p-6 rounded-full mb-6 shadow-sm border border-red-100 group-hover:scale-110 transition-transform duration-300">
                                            {uploading ? (
                                                <Loader2 className="h-12 w-12 animate-spin text-red-600" />
                                            ) : (
                                                <Upload className="h-12 w-12 text-red-500" />
                                            )}
                                        </div>
                                        <div className="text-center px-4">
                                            <h3 className="text-2xl font-black text-gray-900 mb-2">Görsel Seçmek İçin Tıklayın</h3>
                                            <p className="text-gray-500 font-medium max-w-sm mx-auto">
                                                Reklam görselini buradan güncelleyebilirsiniz.
                                            </p>
                                        </div>
                                        <div className="mt-8 px-8 py-4 bg-red-600 text-white rounded-xl font-black shadow-lg shadow-red-600/20 group-hover:bg-red-700 transition-all uppercase tracking-tight">
                                            Değiştir (Gözat)
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Position */}
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700">Görüntülenecek Taraf</label>
                                    <select
                                        className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 bg-white text-sm focus:border-red-600 focus:ring-0 transition-all cursor-pointer font-medium"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    >
                                        <option value="left">Sol Taraf (Sidebar)</option>
                                        <option value="right">Sağ Taraf (Sidebar)</option>
                                    </select>
                                </div>

                                {/* Order */}
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700">Sıralama Önceliği</label>
                                    <Input
                                        type="number"
                                        className="h-12 rounded-xl border-2 border-gray-100 focus:border-red-600 transition-all font-medium"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                                        min={0}
                                    />
                                </div>
                            </div>

                            {/* Link */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 font-bold flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4 text-red-600 rotate-180" />
                                    Tıklayınca Gidilecek Link (Opsiyonel)
                                </label>
                                <Input
                                    placeholder="https://"
                                    className="h-12 rounded-xl border-2 border-gray-100 focus:border-red-600 transition-all font-medium"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                />
                            </div>

                            {/* Is Active */}
                            <div className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-2xl bg-gray-50/50">
                                <div className="space-y-1">
                                    <label className="text-lg font-bold text-gray-900">Reklam Yayında</label>
                                    <p className="text-sm text-gray-500 font-medium">Bu reklamı dilediğiniz zaman duraklatabilirsiniz.</p>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-7 w-7 rounded-lg border-2 border-gray-300 text-red-600 focus:ring-red-600 transition-all cursor-pointer"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black text-lg transition-all shadow-xl shadow-red-600/20 active:scale-[0.98]"
                                disabled={saving || uploading}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                        GÜNCELLENİYOR...
                                    </>
                                ) : (
                                    'DEĞİŞİKLİKLERİ KAYDET'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
