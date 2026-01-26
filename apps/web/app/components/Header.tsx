'use client';

import Link from 'next/link';
import { useLanguage } from '@repo/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
    const { t } = useLanguage();

    return (
        <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-black text-red-600 tracking-tighter">
                    ESNew
                </Link>
                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                            {t.nav.home}
                        </Link>
                    </nav>
                    <LanguageSwitcher />
                </div>
            </div>
        </header>
    );
}
