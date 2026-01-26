'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { slugify, createBrowserClient } from '@repo/lib';
import { MapPin, AlignLeft, Link as LinkIcon, FileText, Info, CheckCircle2 } from 'lucide-react';

export default function NewCityPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        is_active: true,
        seo_title: '',
        seo_description: '',
    });

    const handleNameChange = (value: string) => {
        setFormData({
            ...formData,
            name: value,
            slug: slugify(value),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const supabase = createBrowserClient();

            const { error } = await supabase
                .from('cities')
                .insert([formData]);

            if (error) throw error;

            router.push('/dashboard/cities');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Şehir eklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-red-950 tracking-tight">Yeni Şehir Ekle</h1>
                <p className="text-muted-foreground mt-1">Platformun hizmet vereceği yeni bir lokasyon tanımlayın.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                <Card className="border-red-100 shadow-lg shadow-red-100/20 overflow-visible">
                    <CardHeader className="bg-gradient-to-r from-red-50 to-white border-b border-red-50 py-4">
                        <CardTitle className="flex items-center gap-2 text-red-900 text-lg">
                            <MapPin className="h-5 w-5" /> Şehir Bilgileri
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 grid gap-6">

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Şehir Adı *</label>
                            <div className="relative">
                                <AlignLeft className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                <Input
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="Örn: İstanbul"
                                    required
                                    className="pl-10 border-gray-200 focus:border-red-500 h-11 shadow-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <LinkIcon className="h-3 w-3" /> Slug (URL)
                            </label>
                            <Input
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="istanbul"
                                required
                                className="border-gray-200 bg-gray-50 text-gray-500 font-mono text-sm h-11 shadow-sm"
                            />
                        </div>

                        {/* Status Toggle Card */}
                        <div
                            className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${formData.is_active
                                    ? 'bg-green-50 border-green-300 shadow-lg shadow-green-100/50'
                                    : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                }`}
                            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm ${formData.is_active ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className={`font-bold text-lg ${formData.is_active ? 'text-green-900' : 'text-gray-700'}`}>Şehir Aktif</p>
                                <p className="text-sm text-muted-foreground leading-tight mt-1">Bu şehir sitede listelensin ve kullanıcılar seçim yapabilsin.</p>
                            </div>
                            <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.is_active ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                                {formData.is_active && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                        </div>

                    </CardContent>
                </Card>

                <Card className="border-red-100 shadow-lg shadow-red-100/20 overflow-visible">
                    <CardHeader className="bg-gradient-to-r from-red-50 to-white border-b border-red-50 py-4">
                        <CardTitle className="flex items-center gap-2 text-red-900 text-lg">
                            <FileText className="h-5 w-5" /> SEO Ayarları
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 grid gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">SEO Başlık</label>
                            <Input
                                value={formData.seo_title}
                                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                                placeholder={`${formData.name || '...'} İlanları - En İyi Profiller`}
                                className="border-gray-200 focus:border-red-500 h-11 shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">SEO Açıklama</label>
                            <textarea
                                value={formData.seo_description}
                                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                                placeholder={`${formData.name || '...'} bölgesindeki en popüler ilanlar ve profiller.`}
                                className="w-full min-h-[100px] rounded-xl border border-gray-200 p-4 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none shadow-sm transition-all resize-y"
                            />
                        </div>
                    </CardContent>
                </Card>

                {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-3 font-medium animate-pulse">
                        <Info className="h-5 w-5" />
                        {error}
                    </div>
                )}

                <div className="flex items-center gap-4 sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-2xl z-40">
                    <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-14 text-lg font-bold shadow-lg shadow-red-200 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99]">
                        {loading ? 'Ekleniyor...' : 'Şehri Kaydet'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={loading}
                        className="h-14 px-8 rounded-xl border-gray-300 text-gray-600 hover:bg-gray-50 font-medium"
                    >
                        İptal
                    </Button>
                </div>

                <div className="h-8"></div>
            </form>
        </div>
    );
}
