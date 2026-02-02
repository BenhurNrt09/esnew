'use client';

import { useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, useToast } from '@repo/ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    validateEmail,
    validateUsername,
    validatePassword,
    validatePasswordMatch,
    checkEmailAvailability,
    checkUsernameAvailability
} from '@repo/lib';

export default function ModelRegisterPage() {
    const router = useRouter();
    const toast = useToast();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState<'woman' | 'man' | 'transsexual' | ''>('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!gender) {
                throw new Error('Lütfen cinsiyet seçiniz');
            }

            const emailValidation = validateEmail(email);
            if (!emailValidation.valid) throw new Error(emailValidation.error);

            const usernameValidation = validateUsername(username);
            if (!usernameValidation.valid) throw new Error(usernameValidation.error);

            const passwordValidation = validatePassword(password);
            if (!passwordValidation.valid) throw new Error(passwordValidation.error);

            const matchValidation = validatePasswordMatch(password, confirmPassword);
            if (!matchValidation.valid) throw new Error(matchValidation.error);

            if (!acceptedTerms) {
                throw new Error('Gizlilik politikası ve genel hizmet şartlarını kabul etmelisiniz');
            }

            const emailAvailability = await checkEmailAvailability(email);
            if (!emailAvailability.valid) throw new Error(emailAvailability.error);

            const usernameAvailability = await checkUsernameAvailability(username);
            if (!usernameAvailability.valid) throw new Error(usernameAvailability.error);

            const supabase = createClient();

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                        user_type: 'independent_model',
                        gender,
                    },
                },
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('Kullanıcı oluşturulamadı');

            const { error: profileError } = await supabase
                .from('independent_models')
                .insert({
                    id: authData.user.id,
                    email,
                    username,
                    gender,
                    user_type: 'independent_model',
                });

            if (profileError) throw profileError;

            toast.success('Kayıt başarıyla oluşturuldu!');

            setTimeout(() => {
                router.push('/dashboard');
                router.refresh();
            }, 1000);
        } catch (err: any) {
            setError(err.message || 'Kayıt olunamadı');
            toast.error(err.message || 'Kayıt olunamadı');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-primary">
                        Bağımsız Model Kaydı
                    </CardTitle>
                    <CardDescription className="text-center">
                        Hesabınızı oluşturun
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-sm font-medium">Cinsiyet *</label>
                            <div className="grid grid-cols-3 gap-3">
                                <label className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${gender === 'woman' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="woman"
                                        checked={gender === 'woman'}
                                        onChange={(e) => setGender('woman')}
                                        className="sr-only"
                                        required
                                    />
                                    <span className="text-sm font-medium">Kadın</span>
                                </label>
                                <label className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${gender === 'man' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="man"
                                        checked={gender === 'man'}
                                        onChange={(e) => setGender('man')}
                                        className="sr-only"
                                    />
                                    <span className="text-sm font-medium">Erkek</span>
                                </label>
                                <label className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${gender === 'transsexual' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="transsexual"
                                        checked={gender === 'transsexual'}
                                        onChange={(e) => setGender('transsexual')}
                                        className="sr-only"
                                    />
                                    <span className="text-sm font-medium">Trans</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">E-posta *</label>
                            <Input
                                type="email"
                                placeholder="ornek@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kullanıcı Adı *</label>
                            <Input
                                type="text"
                                placeholder="kullaniciadi"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                minLength={3}
                                maxLength={20}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Şifre *</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Şifre Onayı *</label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-start space-x-2 pt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="w-4 h-4 mt-1 rounded border-input"
                                required
                            />
                            <label htmlFor="terms" className="text-sm cursor-pointer leading-tight">
                                <Link href="/privacy-policy" target="_blank" className="text-primary hover:underline">
                                    Gizlilik Politikası
                                </Link>
                                {' '}ve{' '}
                                <Link href="/terms-of-service" target="_blank" className="text-primary hover:underline">
                                    Genel Hizmet Şartları
                                </Link>
                                {' '}hakkında okudum ve kabul ediyorum *
                            </label>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                        </Button>

                        <div className="text-center text-sm mt-4">
                            Zaten hesabınız var mı?{' '}
                            <Link href="/login/model" className="text-primary hover:underline font-medium">
                                Giriş Yapın
                            </Link>
                        </div>

                        <div className="text-center text-sm">
                            <Link href="/register" className="text-muted-foreground hover:text-primary">
                                ← Geri Dön
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
