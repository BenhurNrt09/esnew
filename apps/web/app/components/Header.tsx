'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { useLanguage } from '@repo/lib/i18n';
import { useRouter } from 'next/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AuthDropdown } from './AuthDropdown';
import { Button } from '@repo/ui';
import { useAuth } from '../components/AuthProvider';

export function Header() {
    const router = useRouter();
    const { t } = useLanguage();
    const { user } = useAuth();
    const supabase = createClient();

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-3 sm:px-4 h-14 md:h-16 flex items-center justify-between relative">
                <div className="flex items-center">
                    {/* Mobile: Flag only, Desktop: Flag + Text */}
                    <div className="block md:hidden">
                        <LanguageSwitcher showText={false} />
                    </div>
                    <div className="hidden md:block">
                        <LanguageSwitcher showText={true} />
                    </div>
                </div>

                <div className="md:absolute left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-auto text-center">
                    <Link
                        href="/"
                        className="text-lg sm:text-2xl md:text-3xl font-black tracking-tighter hover:opacity-90 transition-opacity uppercase inline-block"
                    >
                        <span className="text-primary">Velora</span>
                        <span className="text-black">Escort</span>
                        <span className="text-primary">World</span>
                    </Link>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                    {user ? (
                        <>
                            {/* Desktop: Show email + logout */}
                            <div className="hidden sm:flex items-center gap-2">
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm" className="font-bold text-gray-700 hover:text-primary hover:bg-primary/5 truncate max-w-[8rem] text-xs sm:text-sm">
                                        {user.displayName || user.email?.split('@')[0]}
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="font-bold border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-300 text-xs sm:text-sm px-2 sm:px-3"
                                    onClick={async () => {
                                        await supabase.auth.signOut();
                                        router.push('/');
                                    }}
                                >
                                    {t.auth.logout || 'Çıkış'}
                                </Button>
                            </div>
                            {/* Mobile: Show avatar with slide sidebar */}
                            <div className="sm:hidden">
                                <AuthDropdown user={user} />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Desktop: Show both buttons */}
                            <div className="hidden sm:flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="font-bold text-gray-700 hover:text-primary hover:bg-primary/5 text-xs sm:text-sm px-2 sm:px-3">{t.auth.login}</Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="bg-primary text-white hover:bg-primary/90 font-bold px-2.5 sm:px-3 md:px-6 text-xs sm:text-sm">{t.auth.register}</Button>
                                </Link>
                            </div>
                            {/* Mobile: Show dropdown */}
                            <div className="block sm:hidden">
                                <AuthDropdown user={user} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
