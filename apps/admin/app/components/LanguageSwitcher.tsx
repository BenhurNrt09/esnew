'use client';

import { useLanguage, type Language } from '@repo/lib/i18n';
import { Button } from '@repo/ui';

export function LanguageSwitcher() {
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'tr' ? 'en' : 'tr');
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="ml-4"
        >
            {language === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}
        </Button>
    );
}
