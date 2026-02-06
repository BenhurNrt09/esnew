'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui';

export function DashboardHeader() {
    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm md:hidden">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    {/* Mobile logo could go here */}
                    <span className="font-bold">Velora Admin</span>
                </div>
                <div className="flex items-center gap-4">
                    {/* Items moved to sidebar */}
                </div>
            </div>
        </header>
    );
}
