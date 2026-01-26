'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@repo/lib/i18n';
import { createClient } from '@repo/lib/supabase/client';
import { LogOut } from 'lucide-react';

export function DashboardHeader() {
    const { t } = useLanguage();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    {/* Mobile logo */}
                </div>
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <LogOut className="h-4 w-4" />
                        {t.nav.logout}
                    </Button>
                </div>
            </div>
        </header>
    );
}
