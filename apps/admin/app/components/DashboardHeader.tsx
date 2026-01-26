'use client';

import Link from 'next/link';
import { Button } from '@repo/ui';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@repo/lib/i18n';

export function DashboardHeader() {
    const { t } = useLanguage();

    return (
        <header className="bg-card border-b sticky top-0 z-10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="text-xl font-bold">
                        ESNew Admin
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/dashboard"
                            className="text-sm hover:text-primary transition-colors"
                        >
                            {t.nav.dashboard}
                        </Link>
                        <Link
                            href="/dashboard/cities"
                            className="text-sm hover:text-primary transition-colors"
                        >
                            {t.nav.cities}
                        </Link>
                        <Link
                            href="/dashboard/categories"
                            className="text-sm hover:text-primary transition-colors"
                        >
                            {t.nav.categories}
                        </Link>
                        <Link
                            href="/dashboard/listings"
                            className="text-sm hover:text-primary transition-colors"
                        >
                            {t.nav.listings}
                        </Link>
                        <Link
                            href="/dashboard/features"
                            className="text-sm hover:text-primary transition-colors"
                        >
                            {t.nav.features}
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <form action="/api/logout" method="POST">
                        <Button variant="ghost" size="sm" type="submit">
                            {t.nav.logout}
                        </Button>
                    </form>
                </div>
            </div>
        </header>
    );
}
