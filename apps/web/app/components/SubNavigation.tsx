'use client';

import Link from 'next/link';
import { cn } from "@repo/ui/src/lib/utils";

const mainCategories = [
    { name: 'ESKORTLAR', href: '/ilanlar' },
    { name: 'ŞEHİR TURLARI', href: '/sehir-turlari' },
    { name: 'TRANS & TRANSSEKSÜEL', href: '/kategori/trans' },
    { name: 'BAĞIMSIZ', href: '/kategori/bagimsiz' },
    { name: 'PORNO YILDIZLARI', href: '/kategori/porn-star' },
    { name: 'YEREL', href: '/ilanlar' },
    { name: 'DOMİNATRİX', href: '/kategori/dominatrix' },
];



export function SubNavigation() {
    return (
        <div className="w-full bg-gold-gradient dark:!bg-black dark:!bg-none border-b border-border/50 shadow-lg relative z-[60]">
            {/* Main Categories Bar */}
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-center py-4 gap-x-4 gap-y-3 md:gap-x-4">
                    {mainCategories.map((cat, i) => (
                        <div key={cat.name} className="flex items-center">
                            <Link
                                href={cat.href}
                                className="text-[10px] md:text-xs font-black text-black/80 dark:text-gray-300 hover:text-black dark:hover:text-primary transition-colors uppercase tracking-[0.15em] whitespace-nowrap"
                            >
                                {cat.name}
                            </Link>
                            {i < mainCategories.length - 1 && (
                                <span className="mx-3 md:mx-4 h-3 w-px bg-black/10 dark:bg-white/20"></span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
