'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { useLanguage } from '@repo/lib/i18n';
import { useRouter } from 'next/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '@repo/ui';

export function Header() {
    const router = useRouter();
    const { t } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    return (
        <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
                <div className="flex items-center">
                    <LanguageSwitcher />
                </div>

                <div className="absolute left-1/2 -translate-x-1/2">
                    <Link
                        href="/"
                        className="text-3xl font-black text-primary tracking-tighter hover:opacity-90 transition-opacity uppercase"
                    >
                        ValoraEscort
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm" className="font-bold text-gray-700 hover:text-primary hover:bg-primary/5">
                                    {user.email?.split('@')[0]}
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="sm"
                                className="font-bold border-gray-200"
                                onClick={async () => {
                                    await supabase.auth.signOut();
                                    router.push('/');
                                }}
                            >
                                {t.auth.logout || 'Çıkış'}
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="font-bold text-gray-700 hover:text-primary hover:bg-primary/5">{t.auth.login}</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="bg-primary text-white hover:bg-primary/90 font-bold px-6">{t.auth.register}</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
