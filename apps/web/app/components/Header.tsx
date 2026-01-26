'use client';

import Link from 'next/link';
import { useLanguage } from '@repo/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
    const { t } = useLanguage();

    return (
        <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-center">
                <Link
                    href="/"
                    className="text-3xl font-black text-red-600 tracking-tighter hover:text-red-700 transition-colors"
                >
                    ESNew
                </Link>
                <div className="absolute right-4">
                    <LanguageSwitcher />
                </div>
            </div>
        </header>
    );
}
