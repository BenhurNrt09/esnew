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
        // 10MB limit
        if (file.size > 10 * 1024 * 1024) {
            alert('Dosya boyutu çok yüksek! Lütfen 10MB\'dan küçük bir dosya yükleyin.');
            return;
        }

        try {
            setUploading(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('ads')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('ads').getPublicUrl(filePath);

            setFormData({ ...formData, image_url: data.publicUrl });
            setPreview(data.publicUrl);

        } catch (error: any) {
            alert('Resim yüklenirken hata oluştu: ' + error.message);
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

            const { error } = await supabase.from('ads').insert({
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
                            Yeni Reklam Ekle
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Reklam Görseli</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative cursor-pointer"
                                    onClick={() => document.getElementById('ad-image-upload')?.click()}>

                                    <input
                                        type="file"
                                        id="ad-image-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />

                                    {preview ? (
                                        <div className="relative aspect-square max-h-[300px] mx-auto">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                                            {uploading && (
                                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                                    <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-8">
                                            {uploading ? (
                                                <Loader2 className="h-10 w-10 animate-spin text-gray-400 mx-auto block mb-2" />
                                            ) : (
                                                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                            )}
                                            <p className="text-sm text-gray-500">
                                                {uploading ? 'Yükleniyor...' : 'Görsel yüklemek için tıklayın'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF (Max 10MB)</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Position */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Konum</label>
                                    <select
                                        className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    >
                                        <option value="left">Sol Taraf</option>
                                        <option value="right">Sağ Taraf</option>
                                    </select>
                                </div>

                                {/* Order */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Görüntüleme Sırası</label>
                                    <Input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                                        min={0}
                                    />
                                </div>
                            </div>

                            {/* Link */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Yönlendirilecek Link (Opsiyonel)</label>
                                <Input
                                    placeholder="https://"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                />
                            </div>

                            {/* Is Active */}
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                                <div className="space-y-0.5">
                                    <label className="text-base font-medium">Aktif Durum</label>
                                    <p className="text-xs text-gray-500">Pasif yaparsanız sitede görünmez</p>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-6 w-6 rounded border-gray-300 text-red-600 focus:ring-red-600"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    />
                                </div>
                            </div>

                            <Button type="submit" size="lg" className="w-full bg-red-600 hover:bg-red-700" disabled={loading || uploading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Reklamı Kaydet
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
