'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, useToast } from '@repo/ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isEmail, rememberMe } from '@repo/lib';

export default function MemberLoginPage() {
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

            // If username, fetch the email from members table
            if (!isEmailInput) {
                const { data: member, error: memberError } = await supabase
                    .from('members')
                    .select('email')
                    .eq('username', emailOrUsername)
                    .single();

                if (memberError || !member) {
                    throw new Error('Kullanıcı adı veya şifre hatalı');
                }

                loginEmail = member.email;
            }

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password,
            });

            if (signInError) throw signInError;

            // Handle remember me
            if (remember) {
                rememberMe.save(loginEmail);
            } else {
                rememberMe.clear();
            }

            toast.success('Başarıyla giriş yapıldı!');

            setTimeout(() => {
                router.push('/');
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
        <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-primary">
                        Üye Girişi
                    </CardTitle>
                    <CardDescription className="text-center">
                        E-posta veya kullanıcı adınız ile giriş yapın
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">E-posta veya Kullanıcı Adı</label>
                            <Input
                                type="text"
                                placeholder="ornek@email.com veya kullaniciadi"
                                value={emailOrUsername}
                                onChange={(e) => setEmailOrUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Şifre</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="w-4 h-4 rounded border-input"
                                />
                                <label htmlFor="remember" className="text-sm cursor-pointer">
                                    Beni hatırla
                                </label>
                            </div>
                            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                Şifremi unuttum
                            </Link>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                        </Button>

                        <div className="text-center text-sm mt-4">
                            Hesabınız yok mu?{' '}
                            <Link href="/register/member" className="text-primary hover:underline font-medium">
                                Hemen Kayıt Olun
                            </Link>
                        </div>

                        <div className="text-center text-sm">
                            <Link href="/login" className="text-muted-foreground hover:text-primary">
                                ← Geri Dön
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
