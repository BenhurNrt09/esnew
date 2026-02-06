import { LanguageProvider } from '@repo/lib/i18n';
import { ToastProvider } from '@repo/ui';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider storageKey="admin_language">
            <ToastProvider>
                {children}
            </ToastProvider>
        </LanguageProvider>
    );
}
