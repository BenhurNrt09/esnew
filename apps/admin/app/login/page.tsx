'use client';

import { useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const supabase = createClient();

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Check or create user in database
            const { data: existingUser, error: selectError } = await supabase
                .from('users')
                .select('role')
                .eq('id', data.user.id)
                .maybeSingle();

            // If user doesn't exist in DB, deny admin access (do NOT auto-create as admin)
            if (!existingUser) {
                await supabase.auth.signOut();
                setError('Erişim reddedildi. Hesabınız yönetici değil veya veritabanında kayıtlı değil.');
                return;
            } else if (existingUser.role !== 'admin') {
                // If user exists but isn't admin, deny access
                await supabase.auth.signOut();
                setError('Erişim reddedildi. Bu panele sadece yöneticiler erişebilir.');
                return;
            }

            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Giriş yapılırken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-950 via-gray-900 to-black p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-red-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-red-800/20 rounded-full blur-[100px]"></div>
            </div>

            <Card className="w-full max-w-md relative z-10 border-red-900/30 bg-black/40 backdrop-blur-xl shadow-2xl shadow-red-900/20">
                <CardHeader className="text-center space-y-4 pb-2">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-black text-white tracking-tight">Yönetici Paneli</CardTitle>
                        <CardDescription className="text-red-200/60 text-sm mt-1">
                            Güvenli giriş yaparak yönetim paneline erişin
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-red-200/80 uppercase tracking-wider ml-1">E-posta Adresi</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-red-300/50 group-focus-within:text-red-400 transition-colors" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@domain.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="pl-10 h-12 bg-white/5 border-red-900/30 text-white placeholder:text-white/20 focus:border-red-500 focus:ring-red-500/20 rounded-xl transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-red-200/80 uppercase tracking-wider ml-1">Şifre</label>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-red-300/50 group-focus-within:text-red-400 transition-colors" />
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="pl-10 h-12 bg-white/5 border-red-900/30 text-white placeholder:text-white/20 focus:border-red-500 focus:ring-red-500/20 rounded-xl transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 text-sm animate-pulse">
                                <div className="p-1 bg-red-500/20 rounded-full">
                                    <ShieldCheck className="h-4 w-4 text-red-400" />
                                </div>
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold rounded-xl shadow-lg shadow-red-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                            disabled={loading}
                        >
                            {loading ? (
                                'Kimlik Doğrulanıyor...'
                            ) : (
                                <span className="flex items-center gap-2">
                                    Giriş Yap <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-red-200/40">
                            © 2024 Secure Admin System. All rights reserved.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
