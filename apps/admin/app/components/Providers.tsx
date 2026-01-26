'use client';

import { LanguageProvider } from '@repo/lib/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider storageKey="admin_language">
            {children}
        </LanguageProvider>
    );
}
