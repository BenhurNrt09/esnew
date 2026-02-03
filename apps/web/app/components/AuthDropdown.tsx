'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import { createClient } from '@repo/lib/supabase/client';

export function AuthDropdown() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <div className="relative">
            {/* Profile Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 sm:p-2.5 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-all flex items-center justify-center"
            >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Simple Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop to close dropdown */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Panel */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                        <button
                            onClick={() => {
                                router.push('/dashboard');
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Panel
                        </button>

                        <div className="border-t border-gray-100 my-1" />

                        <button
                            onClick={() => {
                                handleLogout();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Çıkış Yap
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
