'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@repo/ui';
import { useLanguage } from '@repo/lib/i18n';

export default function RegisterPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black px-3 py-12 animate-in fade-in duration-700 transition-colors duration-300">
            <div className="w-full max-w-5xl">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl sm:text-6xl font-black text-black dark:text-white uppercase tracking-tighter drop-shadow-sm">
                        HESAP <span className="text-primary">TÜRÜNÜ SEÇ</span>
                    </h1>
                    <p className="text-black/60 dark:text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs italic">Ayrıcalıklı dünyamıza ilk adımı atın</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
                    {/* Member Registration */}
                    <Link href="/register/member" className="group">
                        <Card className="bg-white/80 dark:bg-[#0a0a0a] border-white/20 dark:border-white/5 hover:border-black/10 dark:hover:border-primary/30 transition-all duration-500 cursor-pointer h-full rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] shadow-2xl shadow-black/5 dark:shadow-primary/5 backdrop-blur-sm">
                            <CardHeader className="pt-10 sm:pt-14 pb-4">
                                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:rotate-12 transition-all duration-500 border border-black/5 dark:border-white/5 group-hover:border-primary/50">
                                    <svg className="w-8 h-8 sm:w-12 sm:h-12 text-black dark:text-primary group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <CardTitle className="text-center text-lg sm:text-2xl font-black text-black dark:text-white uppercase tracking-tighter">{t.profile.memberRegistration}</CardTitle>
                                <CardDescription className="text-center font-bold mt-2 text-black/50 dark:text-gray-500 text-[10px] sm:text-xs uppercase tracking-widest italic">
                                    {t.profile.registerAsRegularMember}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center pb-10 sm:pb-14 px-8">
                                <Button className="w-full h-12 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-black dark:text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl border border-black/5 dark:border-white/10 group-hover:border-primary/50 transition-all text-black dark:text-white">
                                    KAYIT OL
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Independent Model Registration */}
                    <Link href="/register/model" className="group">
                        <Card className="bg-white/90 dark:bg-[#0a0a0a] border-primary/20 hover:border-primary/50 transition-all duration-500 cursor-pointer h-full rounded-[2.5rem] overflow-hidden group hover:scale-[1.05] shadow-2xl shadow-primary/20 relative backdrop-blur-sm">
                            <CardHeader className="pt-10 sm:pt-14 pb-4">
                                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/30 group-hover:rotate-12 transition-all duration-500 border border-primary/30">
                                    <svg className="w-8 h-8 sm:w-12 sm:h-12 text-black dark:text-primary group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <CardTitle className="text-center text-lg sm:text-2xl font-black text-black dark:text-white uppercase tracking-tighter">{t.profile.modelRegistration}</CardTitle>
                                <CardDescription className="text-center font-bold mt-2 text-black/50 dark:text-gray-500 text-[10px] sm:text-xs uppercase tracking-widest italic">
                                    {t.profile.registerAsIndependentModel}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center pb-10 sm:pb-14 px-8">
                                <Button className="w-full h-12 bg-black dark:bg-gold-gradient text-white dark:text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/20 border-none group-hover:scale-[1.02] transition-all">
                                    KAYIT OL
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Agency Registration */}
                    <Link href="/register/agency" className="group">
                        <Card className="bg-white/80 dark:bg-[#0a0a0a] border-white/20 dark:border-white/5 hover:border-black/10 dark:hover:border-primary/30 transition-all duration-500 cursor-pointer h-full rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] shadow-2xl shadow-black/5 dark:shadow-primary/5 backdrop-blur-sm">
                            <CardHeader className="pt-10 sm:pt-14 pb-4">
                                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:rotate-12 transition-all duration-500 border border-black/5 dark:border-white/5 group-hover:border-primary/50">
                                    <svg className="w-8 h-8 sm:w-12 sm:h-12 text-black dark:text-primary group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <CardTitle className="text-center text-lg sm:text-2xl font-black text-black dark:text-white uppercase tracking-tighter">{t.profile.agencyRegistration}</CardTitle>
                                <CardDescription className="text-center font-bold mt-2 text-black/50 dark:text-gray-500 text-[10px] sm:text-xs uppercase tracking-widest italic">
                                    {t.profile.registerAsAgency}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center pb-10 sm:pb-14 px-8">
                                <Button className="w-full h-12 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-black dark:text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl border border-black/5 dark:border-white/10 group-hover:border-primary/50 transition-all text-black dark:text-white">
                                    KAYIT OL
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                <div className="text-center mt-20 p-8 rounded-[2.5rem] bg-white/50 dark:bg-[#0a0a0a] border border-white/20 dark:border-white/5 shadow-2xl relative overflow-hidden group backdrop-blur-sm">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <p className="text-black/70 dark:text-gray-500 font-bold uppercase tracking-widest text-xs relative z-10">
                        {t.auth.alreadyHaveAccount}{' '}
                        <Link href="/login" className="text-black dark:text-primary hover:text-black/70 dark:hover:text-white transition-colors ml-2 font-black italic underline-offset-8 underline decoration-primary/30">
                            GİRİŞ YAP
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
