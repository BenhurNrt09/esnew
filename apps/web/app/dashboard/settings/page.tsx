'use client';

import { useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, useToast } from '@repo/ui';
import { Lock, Trash2, Bell, Shield, Key, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
    const toast = useToast();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Şifreler eşleşmiyor!');
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            toast.error('Hata: ' + error.message);
        } else {
            toast.success('Şifreniz başarıyla güncellendi.');
            setPassword('');
            setConfirmPassword('');
        }
        setLoading(false);
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!');
        if (!confirmed) return;

        toast.info('Bu işlem için yönetici onayı gerekmektedir veya API üzerinden silinmelidir.');
        // In a real app, we'd call a server action or edge function here as users can't delete themselves easily in Supabase without a trigger or admin privileges.
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Hesap Ayarları</h1>
                <p className="text-gray-500 font-medium">Güvenlik ve hesap tercihlerinizi buradan yönetin.</p>
            </div>

            <div className="grid gap-8">
                {/* Password Update */}
                <Card className="shadow-sm border-gray-100 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                        <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                            <Key className="w-5 h-5 text-primary" /> Şifreyi Güncelle
                        </CardTitle>
                        <CardDescription>Güvenliğiniz için düzenli olarak şifrenizi değiştirin.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handlePasswordUpdate} className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Yeni Şifre</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="rounded-xl h-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Şifre Tekrar</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="rounded-xl h-12"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-primary text-white font-black uppercase tracking-widest px-8 h-12 rounded-xl shadow-lg shadow-primary/20"
                                >
                                    {loading ? 'GÜNCELLENİYOR...' : 'ŞİFREYİ GÜNCELLE'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="shadow-sm border-gray-100 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                        <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" /> Bildirim Tercihleri
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                        {[
                            { label: 'E-posta Bildirimleri', desc: 'Yeni yorum ve mesajlarda e-posta al.' },
                            { label: 'Profil Görüntülenme', desc: 'Haftalık istatistik raporlarını al.' },
                            { label: 'Pazarlama', desc: 'Yeni özellikler ve güncellemelerden haberdar ol.' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                <div className="space-y-0.5">
                                    <h4 className="font-bold text-gray-900">{item.label}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                                </div>
                                <div className="w-12 h-6 bg-primary rounded-full relative">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="shadow-sm border-red-100 rounded-3xl overflow-hidden border-2 bg-red-50/20">
                    <CardHeader className="bg-red-50/50 border-b border-red-100">
                        <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" /> Tehlikeli Bölge
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="font-bold text-gray-900">Hesabı Sil</h4>
                            <p className="text-xs text-gray-500 font-medium">Tüm verileriniz ve ilanlarınız kalıcı olarak silinecektir.</p>
                        </div>
                        <Button
                            variant="destructive"
                            className="rounded-xl font-black uppercase tracking-widest h-12 px-8"
                            onClick={handleDeleteAccount}
                        >
                            HESABI SİL
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
