'use client';

import { useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { cn } from '@repo/ui/src/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, useToast } from '@repo/ui';
import { Lock, Trash2, Bell, Shield, Key, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
    const toast = useToast();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [notifications, setNotifications] = useState({
        email: true,
        stats: true,
        marketing: false
    });

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

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => {
            const newState = { ...prev, [key]: !prev[key] };
            toast.success('Bildirim tercihleri güncellendi.');
            return newState;
        });
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!');
        if (!confirmed) return;

        toast.info('Bu işlem için yönetici onayı gerekmektedir.');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                    <span className="text-gold-gradient">Hesap Ayarları</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium italic">Güvenlik ve hesap tercihlerinizi buradan yönetin.</p>
            </div>

            <div className="grid gap-8">
                {/* Password Update */}
                <Card className="bg-white dark:bg-[#0a0a0a] border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-none">
                    <CardHeader className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                        <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2 text-gray-900 dark:text-white">
                            <Key className="w-5 h-5 text-primary" /> Şifreyi Güncelle
                        </CardTitle>
                        <CardDescription className="text-gray-400 dark:text-gray-500">Güvenliğiniz için düzenli olarak şifrenizi değiştirin.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handlePasswordUpdate} className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Yeni Şifre</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 dark:bg-black/50 border-gray-100 dark:border-white/10 rounded-xl h-12 text-gray-900 dark:text-white focus:border-primary/50"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Şifre Tekrar</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 dark:bg-black/50 border-gray-100 dark:border-white/10 rounded-xl h-12 text-gray-900 dark:text-white focus:border-primary/50"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gold-gradient text-black font-black uppercase tracking-widest px-8 h-12 rounded-xl shadow-lg shadow-primary/20 border-none transition-transform hover:scale-105"
                                >
                                    {loading ? 'GÜNCELLENİYOR...' : 'ŞİFREYİ GÜNCELLE'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="bg-white dark:bg-[#0a0a0a] border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-none">
                    <CardHeader className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                        <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2 text-gray-900 dark:text-white">
                            <Bell className="w-5 h-5 text-primary" /> Bildirim Tercihleri
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                        {[
                            { id: 'email', label: 'E-posta Bildirimleri', desc: 'Yeni yorum ve mesajlarda e-posta al.' },
                            { id: 'stats', label: 'Profil Görüntülenme', desc: 'Haftalık istatistik raporlarını al.' },
                            { id: 'marketing', label: 'Pazarlama', desc: 'Yeni özellikler ve güncellemelerden haberdar ol.' }
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 group hover:border-primary/30 transition-all">
                                <div className="space-y-0.5">
                                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{item.label}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium italic">{item.desc}</p>
                                </div>
                                <button
                                    onClick={() => toggleNotification(item.id as any)}
                                    className={cn(
                                        "w-12 h-6 rounded-full transition-all relative",
                                        notifications[item.id as keyof typeof notifications] ? "bg-primary" : "bg-gray-200 dark:bg-white/10"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md",
                                        notifications[item.id as keyof typeof notifications] ? "right-1" : "left-1"
                                    )} />
                                </button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="bg-red-950/20 border-red-900/30 rounded-3xl overflow-hidden border shadow-2xl">
                    <CardHeader className="bg-red-950/30 border-b border-red-900/30">
                        <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2 text-red-500">
                            <AlertTriangle className="w-5 h-5" /> Tehlikeli Bölge
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="font-bold text-gray-900 dark:text-white">Hesabı Sil</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium italic">Tüm verileriniz ve ilanlarınız kalıcı olarak silinecektir.</p>
                        </div>
                        <Button
                            variant="destructive"
                            className="rounded-xl font-black uppercase tracking-widest h-12 px-8 shadow-xl shadow-red-900/20 hover:scale-105 transition-all"
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
