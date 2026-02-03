'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, User, LogIn, UserPlus } from 'lucide-react';
import { createClient } from '@repo/lib/supabase/client';
import { useLanguage } from '@repo/lib/i18n';
import { cn } from '@repo/ui/src/lib/utils';

export function AuthDropdown({ user }: { user?: any }) {
    const router = useRouter();
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    return (
        <div className="relative">
            {/* Profile Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "p-2 sm:p-2.5 rounded-full transition-all flex items-center justify-center",
                    user ? "bg-gray-100 hover:bg-primary hover:text-white" : "bg-primary text-white shadow-lg shadow-primary/20"
                )}
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
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden">
                        {user ? (
                            <>
                                <button
                                    onClick={() => {
                                        router.push('/dashboard');
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <LayoutDashboard className="w-4 h-4 text-gray-400" />
                                    Panel
                                </button>

                                <div className="border-t border-gray-100 my-1" />

                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    {t.auth.logout || 'Çıkış Yap'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        router.push('/login');
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <LogIn className="w-4 h-4 text-gray-400" />
                                    {t.auth.login || 'Giriş Yap'}
                                </button>

                                <button
                                    onClick={() => {
                                        router.push('/register');
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    {t.auth.register || 'Kayıt Ol'}
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
