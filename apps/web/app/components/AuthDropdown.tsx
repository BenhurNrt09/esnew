'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { UserCircle, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@repo/ui';
import { useLanguage } from '@repo/lib/i18n';

export function AuthDropdown() {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="h-9 w-9 p-0 rounded-full hover:bg-primary/10"
            >
                <UserCircle className="h-5 w-5 text-gray-700" />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                        href="/login"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <LogIn className="h-4 w-4" />
                        <span>{t.auth.login}</span>
                    </Link>
                    <Link
                        href="/register"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <UserPlus className="h-4 w-4" />
                        <span>{t.auth.register}</span>
                    </Link>
                </div>
            )}
        </div>
    );
}
