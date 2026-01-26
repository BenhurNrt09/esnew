'use client';

import { useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@repo/ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const supabase = createClient();
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: 'user',
                    },
                },
            });

            if (error) throw error;

            // Otomatik giriş yapmışsa profil sayfasına at, yoksa email onayına
            if (data.session) {
                router.push('/profile/create');
            } else {
                setError('Kayıt başarılı! Lütfen email adresinizi doğrulayın.');
            }

        } catch (err: any) {
            setError(err.message || 'Kayıt olunamadı');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-primary">ESNew'e Katılın</CardTitle>
                    <CardDescription className="text-center">
                        Profilinizi oluşturun ve binlerce kişiye ulaşın.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        {error && (
                            <div className={`p-3 rounded-md text-sm ${error.includes('başarılı') ? 'bg-green-100 text-green-700' : 'bg-destructive/10 text-destructive'}`}>
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">E-posta</label>
                            <Input
                                type="email"
                                placeholder="ornek@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                minLength={6}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                        </Button>
                        <div className="text-center text-sm mt-4">
                            Zaten hesabınız var mı?{' '}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Giriş Yapın
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
