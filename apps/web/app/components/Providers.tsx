import { LanguageProvider } from '@repo/lib/i18n';
import { ToastProvider } from '@repo/ui';
import { AuthProvider } from './AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <AuthProvider>
                <LanguageProvider storageKey="web_language">
                    {children}
                </LanguageProvider>
            </AuthProvider>
        </ToastProvider>
    );
}
