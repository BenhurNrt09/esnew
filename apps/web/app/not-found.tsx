'use client';

import Link from 'next/link';
import { Button } from '@repo/ui';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <h2 className="text-8xl font-black text-red-100 mb-4">404</h2>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Sayfa Bulunamadı
            </h1>
            <p className="text-gray-500 max-w-md mb-8">
                Aradığınız sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.
            </p>
            <Link href="/">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white gap-2">
                    <Home className="h-4 w-4" /> Ana Sayfaya Dön
                </Button>
            </Link>
        </div>
    );
}
