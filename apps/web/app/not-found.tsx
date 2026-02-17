'use client';

import Link from 'next/link';
import { Button } from '@repo/ui';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <h2 className="text-8xl font-black text-primary mb-4 drop-shadow-sm">404</h2>
            <h1 className="text-3xl font-bold mb-4">
                Sayfa Bulunamadı
            </h1>
            <p className="text-muted-foreground max-w-md mb-8">
                Aradığınız sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.
            </p>
            <Link href="/">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-black font-bold gap-2 shadow-lg shadow-primary/20 transition-all">
                    <Home className="h-4 w-4" /> Ana Sayfaya Dön
                </Button>
            </Link>
        </div>
    );
}
