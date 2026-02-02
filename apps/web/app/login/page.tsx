'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, useToast } from '@repo/ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isEmail, rememberMe } from '@repo/lib';

export default function LoginPage() {
    const router = useRouter();
    const toast = useToast();
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load remembered email if exists
        const remembered = rememberMe.get();
        if (remembered) {
            setEmailOrUsername(remembered);
            setRemember(true);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const supabase = createClient();

            // Determine if input is email or username
            const isEmailInput = isEmail(emailOrUsername);

            let loginEmail = emailOrUsername;

            // If username, try to find the email in all three user tables
            if (!isEmailInput) {
                // Check members
                const { data: member } = await supabase
                    .from('members')
                    .select('email')
                    .eq('username', emailOrUsername)
                    .single();

                if (member) {
                    loginEmail = member.email;
                } else {
                    // Check models
                    const { data: model } = await supabase
                        .from('independent_models')
                        .select('email')
                        .eq('username', emailOrUsername)
                        .single();

                    if (model) {
                        loginEmail = model.email;
                    } else {
                        // Check agencies
                        const { data: agency } = await supabase
                            .from('agencies')
                            .select('email')
                            .eq('username', emailOrUsername)
                            .single();

                        if (agency) {
                            loginEmail = agency.email;
                        } else {
                            throw new Error('Kullanıcı adı veya şifre hatalı');
                        }
                    }
                }
            }

            const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password,
            });

            if (signInError) throw signInError;

            // Update user metadata with original username (preserving case)
            if (signInData?.user && !isEmailInput) {
                const { error: updateError } = await supabase.auth.updateUser({
                    data: { 
                        original_username: emailOrUsername,
                        display_name: emailOrUsername
                    }
                });
                if (updateError) console.error('Error updating metadata:', updateError);
            }

            // Handle remember me
            if (remember) {
                rememberMe.save(loginEmail);
            } else {
                rememberMe.clear();
            }

            toast.success('Başarıyla giriş yapıldı!');

            setTimeout(() => {
                router.push('/dashboard');
                router.refresh();
            }, 500);
        } catch (err: any) {
            setError(err.message || 'Giriş yapılamadı');
            toast.error(err.message || 'Giriş yapılamadı');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4 py-12">
            <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary">
                <CardHeader>
                    <CardTitle className="text-3xl font-black text-center text-primary uppercase tracking-tighter">
                        Giriş Yap
                    </CardTitle>
                    <CardDescription className="text-center font-medium">
                        Platforma erişmek için bilgilerinizi girin
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 font-medium animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">E-posta veya Kullanıcı Adı</label>
                            <Input
                                type="text"
                                placeholder="ornek@email.com veya kullaniciadi"
                                value={emailOrUsername}
                                onChange={(e) => setEmailOrUsername(e.target.value)}
                                required
                                className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20 h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-bold text-gray-700">Şifre</label>
                                <Link href="/forgot-password" title="Şifremi unuttum" className="text-xs font-bold text-primary hover:underline">
                                    Şifremi unuttum?
                                </Link>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20 h-12"
                            />
                        </div>

                        <div className="flex items-center space-x-2 ml-1">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                            />
                            <label htmlFor="remember" className="text-sm font-medium text-gray-600 cursor-pointer select-none">
                                Beni hatırla
                            </label>
                        </div>

                        <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20" disabled={loading}>
                            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                        </Button>

                        <div className="text-center text-sm pt-2">
                            <span className="text-gray-500 font-medium">Hesabınız yok mu?</span>{' '}
                            <Link href="/register" className="text-primary hover:underline font-bold">
                                Hemen Kayıt Olun
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

