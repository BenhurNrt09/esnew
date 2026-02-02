'use client';

import { LanguageProvider } from '@repo/lib/i18n';
import { ToastProvider } from '@repo/ui';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <LanguageProvider storageKey="web_language">
                {children}
            </LanguageProvider>
        </ToastProvider>
    );
}
