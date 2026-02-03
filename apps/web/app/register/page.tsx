'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@repo/ui';
import { useLanguage } from '@repo/lib/i18n';

export default function RegisterPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 px-3 py-8">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-6">
                    <h1 className="text-2xl sm:text-4xl font-bold text-primary mb-2">{t.auth.register}</h1>
                    <p className="text-muted-foreground text-sm">{t.profile.alreadyHaveAccount && 'Hesap türünüzü seçin'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
                    {/* Member Registration */}
                    <Link href="/register/member" className="group">
                        <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full border hover:border-primary bg-white">
                            <CardHeader className="pt-4 sm:pt-8 pb-2">
                                <div className="w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-6 rounded-xl sm:rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:rotate-6 transition-all duration-300">
                                    <svg className="w-6 h-6 sm:w-10 sm:h-10 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <CardTitle className="text-center text-sm sm:text-xl font-black uppercase tracking-tight">{t.profile.memberRegistration}</CardTitle>
                                <CardDescription className="text-center font-medium mt-1 text-xs sm:text-sm">
                                    {t.profile.registerAsRegularMember}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center pb-4 sm:pb-8">
                                <Button className="w-full h-9 sm:h-10 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm rounded-lg sm:rounded-xl shadow-lg shadow-primary/20">
                                    {t.profile.signIn}
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Independent Model Registration */}
                    <Link href="/register/model" className="group">
                        <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full border hover:border-primary bg-white">
                            <CardHeader className="pt-4 sm:pt-8 pb-2">
                                <div className="w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-6 rounded-xl sm:rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:rotate-6 transition-all duration-300">
                                    <svg className="w-6 h-6 sm:w-10 sm:h-10 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <CardTitle className="text-center text-sm sm:text-xl font-black uppercase tracking-tight">{t.profile.modelRegistration}</CardTitle>
                                <CardDescription className="text-center font-medium mt-1 text-xs sm:text-sm">
                                    {t.profile.registerAsIndependentModel}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center pb-4 sm:pb-8">
                                <Button className="w-full h-9 sm:h-10 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm rounded-lg sm:rounded-xl shadow-lg shadow-primary/20">
                                    {t.profile.submit}
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Agency Registration */}
                    <Link href="/register/agency" className="group">
                        <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full border hover:border-primary bg-white">
                            <CardHeader className="pt-4 sm:pt-8 pb-2">
                                <div className="w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-6 rounded-xl sm:rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:rotate-6 transition-all duration-300">
                                    <svg className="w-6 h-6 sm:w-10 sm:h-10 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <CardTitle className="text-center text-sm sm:text-xl font-black uppercase tracking-tight">{t.profile.agencyRegistration}</CardTitle>
                                <CardDescription className="text-center font-medium mt-1 text-xs sm:text-sm">
                                    {t.profile.registerAsAgency}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center pb-4 sm:pb-8">
                                <Button className="w-full h-9 sm:h-10 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm rounded-lg sm:rounded-xl shadow-lg shadow-primary/20">
                                    {t.profile.signIn}
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                <div className="text-center mt-12 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-100">
                    <p className="text-gray-600 font-medium">
                        {t.auth.alreadyHaveAccount}{' '}
                        <Link href="/login" className="text-primary hover:underline font-black uppercase tracking-wider ml-1">
                            {t.auth.login}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
