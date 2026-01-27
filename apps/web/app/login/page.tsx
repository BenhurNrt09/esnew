'use client';

import { useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@repo/ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@repo/lib/i18n';

export default function LoginPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Giriş yapılamadı');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-primary uppercase tracking-tighter">ValoraEscort</CardTitle>
                    <CardDescription className="text-center">
                        {t.auth.login}
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
                            <label className="text-sm font-medium">{t.auth.email}</label>
                            <Input
                                type="email"
                                placeholder="ornek@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t.auth.password}</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? t.common.loading : t.auth.loginButton}
                        </Button>
                        <div className="text-center text-sm mt-4">
                            Hesabınız yok mu?{' '}
                            <Link href="/register" className="text-primary hover:underline font-medium">
                                Hemen Kayıt Olun
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
