'use client';

import { useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, useToast } from '@repo/ui';
import Link from 'next/link';
import { validateEmail } from '@repo/lib';

export default function ForgotPasswordPage() {
    const toast = useToast();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const emailValidation = validateEmail(email);
            if (!emailValidation.valid) {
                throw new Error(emailValidation.error);
            }

            const supabase = createClient();
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setSent(true);
            toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!');
        } catch (err: any) {
            toast.error(err.message || 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-primary">
                        Şifremi Unuttum
                    </CardTitle>
                    <CardDescription className="text-center">
                        {sent
                            ? 'E-posta adresinizi kontrol edin'
                            : 'E-posta adresinize şifre sıfırlama bağlantısı göndereceğiz'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {sent ? (
                        <div className="space-y-4">
                            <div className="bg-primary/10 text-primary text-sm p-4 rounded-md">
                                Şifre sıfırlama bağlantısı <strong>{email}</strong> adresine gönderildi.
                                Lütfen e-posta kutunuzu kontrol edin.
                            </div>
                            <div className="text-center text-sm">
                                <Link href="/login" className="text-primary hover:underline">
                                    ← Giriş sayfasına dön
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">E-posta Adresi</label>
                                <Input
                                    type="email"
                                    placeholder="ornek@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                            </Button>

                            <div className="text-center text-sm">
                                <Link href="/login" className="text-muted-foreground hover:text-primary">
                                    ← Giriş sayfasına dön
                                </Link>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
