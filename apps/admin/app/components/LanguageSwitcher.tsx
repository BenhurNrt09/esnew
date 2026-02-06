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
            className="ml-4 w-20 relative overflow-hidden group border-primary/20 hover:border-primary/50"
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
                    <>
                        <span className="text-2xl">🇹🇷</span>
                    </>
                    ) : (
                    <>
                        <span className="text-2xl">🇬🇧</span>
                    </>
                    )}
                </motion.div>
            </AnimatePresence>
        </Button>
    );
}
