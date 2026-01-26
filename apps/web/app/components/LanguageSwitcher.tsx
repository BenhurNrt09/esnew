'use client';

import { useLanguage } from '@repo/lib/i18n';
import { Button } from '@repo/ui';

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'tr' ? 'en' : 'tr');
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="ml-4 bg-background text-foreground"
        >
            {language === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}
        </Button>
    );
}
