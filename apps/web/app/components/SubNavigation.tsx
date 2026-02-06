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
        <div className="w-full bg-[#1A1A1A] border-b border-white/5 shadow-lg">
            {/* Main Categories Bar */}
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-center py-3 gap-x-2 md:gap-x-4">
                    {mainCategories.map((cat, i) => (
                        <div key={cat.name} className="flex items-center">
                            <Link
                                href={cat.href}
                                className="text-[10px] md:text-xs font-black text-gray-300 hover:text-primary transition-colors uppercase tracking-widest whitespace-nowrap"
                            >
                                {cat.name}
                            </Link>
                            {i < mainCategories.length - 1 && (
                                <span className="mx-2 md:mx-4 h-4 w-px bg-white/10 hidden sm:block"></span>
                            )}
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
}
