import { LanguageProvider } from '@repo/lib/i18n';
import { ToastProvider } from '@repo/ui';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <ToastProvider>
                <AuthProvider>
                    <LanguageProvider storageKey="web_language">
                        {children}
                    </LanguageProvider>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}
