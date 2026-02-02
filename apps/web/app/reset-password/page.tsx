'use client';

import { useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, useToast } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { validatePassword, validatePasswordMatch } from '@repo/lib';

export default function ResetPasswordPage() {
    const router = useRouter();
    const toast = useToast();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.valid) {
                throw new Error(passwordValidation.error);
            }

            const matchValidation = validatePasswordMatch(password, confirmPassword);
            if (!matchValidation.valid) {
                throw new Error(matchValidation.error);
            }

            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            toast.success('Şifreniz başarıyla güncellendi!');

            setTimeout(() => {
                router.push('/login');
            }, 1500);
        } catch (err: any) {
            toast.error(err.message || 'Şifre güncellenemedi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-primary">
                        Yeni Şifre Belirle
                    </CardTitle>
                    <CardDescription className="text-center">
                        Hesabınız için yeni bir şifre oluşturun
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Yeni Şifre</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                            <p className="text-xs text-muted-foreground">
                                En az 8 karakter, bir harf ve bir rakam içermeli
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Şifre Onayı</label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
