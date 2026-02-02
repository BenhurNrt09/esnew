'use client';

import { useLanguage } from '@repo/lib/i18n';
import { Button } from '@repo/ui';
import { motion, AnimatePresence } from 'framer-motion';

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
            className="w-20 relative overflow-hidden group border-primary/20 hover:border-primary/50 bg-background/50 backdrop-blur-sm"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={language}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 absolute inset-0 justify-center"
                >
                    {language === 'tr' ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" className="w-5 h-3.5 rounded-sm shadow-sm object-cover">
                                <path fill="#E30A17" d="M0 0h1200v800H0z" />
                                <circle cx="425" cy="400" r="200" fill="#fff" />
                                <circle cx="475" cy="400" r="160" fill="#E30A17" />
                                <path fill="#fff" d="M583.334 400l180.901 63.603-107.755-164.293v201.38l107.755-164.293z" />
                            </svg>
                            <span className="font-bold text-xs tracking-wide">TR</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-5 h-3.5 rounded-sm shadow-sm object-cover">
                                <clipPath id="a"><path d="M0 0v30h60V0z" /></clipPath>
                                <path d="M0 0v30h60V0z" fill="#012169" />
                                <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
                                <path d="M0 0l60 30m0-30L0 30" stroke="#c8102e" strokeWidth="4" />
                                <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
                                <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
                            </svg>
                            <span className="font-bold text-xs tracking-wide">EN</span>
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </Button>
    );
}
