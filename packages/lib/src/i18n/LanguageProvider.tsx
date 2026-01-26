'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Language, type Translations } from './translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
    children,
    storageKey = 'language'
}: {
    children: React.ReactNode;
    storageKey?: string;
}) {
    const [language, setLanguageState] = useState<Language>('tr');

    useEffect(() => {
        // Load from localStorage with custom key
        const saved = localStorage.getItem(storageKey) as Language;
        if (saved && (saved === 'tr' || saved === 'en')) {
            setLanguageState(saved);
        }
    }, [storageKey]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem(storageKey, lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}
