'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { useLanguage } from '@repo/lib/i18n';
import { useRouter } from 'next/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AuthDropdown } from './AuthDropdown';
import { Button } from '@repo/ui';
import { useAuth } from '../components/AuthProvider';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, LogOut, Heart, User } from 'lucide-react';

export function Header() {
    const router = useRouter();
    const { t } = useLanguage();
    const { user } = useAuth();
    const supabase = createClient();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between relative">

                {/* Left Section: Language */}
                <div className="flex-1 flex justify-start items-center">
                    <LanguageSwitcher showText={false} />
                    {/* PC View: Login/Register if not logged in (Optional, but user said specific things for mobile. Let's keep desktop clean) */}
                </div>

                {/* Center Section: Logo */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Link href="/" className="flex flex-col items-center group">
                        <h1 className="text-2xl md:text-3xl font-black tracking-tighter leading-none">
                            <span className="text-foreground">VELORA</span>
                        </h1>
                        {/* Subtitle always visible now */}
                        <span className="text-[8px] md:text-[10px] text-primary font-bold tracking-[0.2em] uppercase opacity-100 transition-opacity whitespace-nowrap">
                            Escort World
                        </span>
                    </Link>
                </div>

                {/* Right Section: Actions */}
                <div className="flex-1 flex justify-end items-center gap-3">
                    <ThemeToggle />

                    <div className="h-6 w-px bg-border hidden sm:block mx-1"></div>

                    {/* Desktop Auth */}
                    <div className="hidden sm:flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm" className="font-bold text-xs uppercase tracking-wide">
                                        {user.email?.split('@')[0]}
                                    </Button>
                                </Link>
                                <button
                                    onClick={async () => {
                                        await supabase.auth.signOut();
                                        window.location.href = '/';
                                    }}
                                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                                    title="Çıkış"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="font-bold uppercase tracking-wide text-xs">
                                        {t.auth.login}
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="bg-primary text-black hover:bg-white hover:text-black font-black uppercase tracking-wide text-xs border-none shadow-lg shadow-primary/20 transition-all">
                                        {t.auth.register}
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile User Icon Toggle */}
                    <div className="sm:hidden relative">
                        <button
                            className="p-2 text-foreground active:scale-95 transition-transform"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <User className="w-6 h-6" />
                        </button>

                        {/* Mobile Auth Menu Popover */}
                        {isMobileMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl p-2 flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-top-2">
                                {user ? (
                                    <>
                                        <div className="px-3 py-2 text-xs font-bold text-muted-foreground border-b border-border mb-1">
                                            {user.email}
                                        </div>
                                        <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="ghost" size="sm" className="w-full justify-start text-xs font-bold uppercase">
                                                Hesabım
                                            </Button>
                                        </Link>
                                        <button
                                            onClick={async () => {
                                                await supabase.auth.signOut();
                                                window.location.href = '/';
                                            }}
                                            className="w-full flex items-center px-3 py-2 text-xs font-bold uppercase text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" /> Çıkış Yap
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="ghost" size="sm" className="w-full justify-start text-xs font-bold uppercase">
                                                Giriş Yap
                                            </Button>
                                        </Link>
                                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button size="sm" className="w-full bg-primary text-black hover:bg-white text-xs font-black uppercase">
                                                Kayıt Ol
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
