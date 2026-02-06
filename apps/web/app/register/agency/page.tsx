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
import { ModernSelection } from '../../components/ModernSelection';

type BusinessType = 'escort_agency' | 'private_apartment' | 'brothel_studio_club' | 'massage_salon' | 'agency_company' | 'escort_directory' | 'sauna' | '';

const businessTypes = [
    { value: 'escort_agency', label: 'Eskort Ajansı' },
    { value: 'private_apartment', label: 'Özel Daire' },
    { value: 'brothel_studio_club', label: 'Genelev/Stüdyo/Kulüp' },
    { value: 'massage_salon', label: 'Masaj Salonu' },
    { value: 'agency_company', label: 'Ajans/Şirket' },
    { value: 'escort_directory', label: 'Escort Rehberi' },
    { value: 'sauna', label: 'Sauna' },
];

export default function AgencyRegisterPage() {
    const router = useRouter();
    const toast = useToast();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [businessType, setBusinessType] = useState<BusinessType>('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!businessType) {
                throw new Error('Lütfen işletme türünü seçiniz');
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
                        user_type: 'agency',
                        business_type: businessType,
                    },
                },
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('Kullanıcı oluşturulamadı');

            // Using upsert to prevent unique constraint violations
            const { error: profileError } = await supabase
                .from('agencies')
                .upsert({
                    id: authData.user.id,
                    email,
                    username,
                    business_type: businessType,
                    user_type: 'agency',
                }, { onConflict: 'id' });

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black px-4 py-20 animate-in fade-in duration-700 transition-colors duration-300">
            <Card className="w-full max-w-md bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden shadow-black/5 dark:shadow-primary/5">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">
                        AJANS <span className="text-primary">KAYDI</span>
                    </CardTitle>
                    <CardDescription className="text-black/60 dark:text-gray-500 italic font-medium"> Ajans veya şirket profilinizi oluşturun </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleRegister} className="space-y-6">
                        {error && (
                            <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-xs font-bold p-4 rounded-2xl italic animate-pulse">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-black/60 dark:text-gray-500 uppercase tracking-widest ml-1">İşletme Türü *</label>
                            <ModernSelection
                                value={businessType}
                                onChange={(val) => setBusinessType(val as BusinessType)}
                                options={[
                                    { value: 'escort_agency', label: 'Eskort Ajansı', description: 'Profesyonel ajans' },
                                    { value: 'private_apartment', label: 'Özel Daire', description: 'Bağımsız daire yönetimi' },
                                    { value: 'brothel_studio_club', label: 'Kulüp / Stüdyo', description: 'Eğlence mekanları' },
                                    { value: 'massage_salon', label: 'Masaj Salonu', description: 'Masaj ve spa merkezleri' },
                                    { value: 'agency_company', label: 'Ajans/Şirket', description: 'Genel işletme kaydı' },
                                    { value: 'escort_directory', label: 'Escort Rehberi', description: 'Liste ve rehber siteleri' },
                                    { value: 'sauna', label: 'Sauna', description: 'Sauna tesisleri' },
                                ]}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-black/60 dark:text-gray-500 uppercase tracking-widest ml-1">E-posta Adresi *</label>
                            <Input
                                type="email"
                                placeholder="ornek@email.com"
                                className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl h-12 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-700 focus:border-primary/50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-black/60 dark:text-gray-500 uppercase tracking-widest ml-1">Kullanıcı Adı *</label>
                            <Input
                                type="text"
                                placeholder="ajansadi"
                                className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl h-12 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-700 focus:border-primary/50"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                minLength={3}
                                maxLength={20}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-black/60 dark:text-gray-500 uppercase tracking-widest ml-1">Şifre *</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl h-12 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-700 focus:border-primary/50"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-black/60 dark:text-gray-500 uppercase tracking-widest ml-1">Tekrar *</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl h-12 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-700 focus:border-primary/50"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 pt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="w-5 h-5 mt-0.5 rounded-lg border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-primary focus:ring-primary/20"
                                required
                            />
                            <label htmlFor="terms" className="text-[10px] cursor-pointer leading-relaxed text-black/60 dark:text-gray-500 font-bold uppercase tracking-tight">
                                <Link href="/privacy-policy" target="_blank" className="text-black dark:text-primary hover:text-black/80 dark:hover:text-white transition-colors">
                                    Gizlilik Politikası
                                </Link>
                                {' '}ve{' '}
                                <Link href="/terms-of-service" target="_blank" className="text-black dark:text-primary hover:text-black/80 dark:hover:text-white transition-colors">
                                    Hizmet Şartlarını
                                </Link>
                                {' '}KABUL EDİYORUM *
                            </label>
                        </div>

                        <Button type="submit" className="w-full h-14 bg-black dark:bg-gold-gradient text-white dark:text-black font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all border-none" disabled={loading}>
                            {loading ? 'KAYDEDİLİYOR...' : 'HESABIMI OLUŞTUR'}
                        </Button>

                        <div className="text-center pt-2">
                            <p className="text-[10px] text-black/60 dark:text-gray-500 font-black uppercase tracking-widest">
                                Zaten üye misiniz?{' '}
                                <Link href="/login/agency" className="text-black dark:text-primary hover:text-black/80 dark:hover:text-white transition-colors">
                                    GİRİŞ YAP
                                </Link>
                            </p>
                        </div>

                        <div className="flex justify-center pt-4 border-t border-black/10 dark:border-white/5">
                            <Link href="/register" className="text-[10px] font-black text-black/60 dark:text-gray-600 hover:text-black dark:hover:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                ← GERİ DÖN
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
