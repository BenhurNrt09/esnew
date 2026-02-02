'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@repo/ui';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4 py-12">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">Kayıt Ol</h1>
                    <p className="text-muted-foreground">Hesap türünüzü seçin</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Member Registration */}
                    <Link href="/register/member" className="group">
                        <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer h-full border-2 hover:border-primary bg-white">
                            <CardHeader className="pt-8">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:rotate-6 transition-all duration-300">
                                    <svg className="w-10 h-10 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <CardTitle className="text-center text-xl font-black uppercase tracking-tight">Üye Kaydı</CardTitle>
                                <CardDescription className="text-center font-medium mt-2">
                                    Normal üye olarak hemen kayıt olun
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center pb-8">
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20">
                                    Hemen Katıl
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Independent Model Registration */}
                    <Link href="/register/model" className="group">
                        <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer h-full border-2 hover:border-primary bg-white">
                            <CardHeader className="pt-8">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:rotate-6 transition-all duration-300">
                                    <svg className="w-10 h-10 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <CardTitle className="text-center text-xl font-black uppercase tracking-tight">Model Kaydı</CardTitle>
                                <CardDescription className="text-center font-medium mt-2">
                                    Bağımsız model olarak profilinizi oluşturun
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center pb-8">
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20">
                                    Profil Oluştur
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Agency Registration */}
                    <Link href="/register/agency" className="group">
                        <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer h-full border-2 hover:border-primary bg-white">
                            <CardHeader className="pt-8">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:rotate-6 transition-all duration-300">
                                    <svg className="w-10 h-10 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <CardTitle className="text-center text-xl font-black uppercase tracking-tight">Ajans Kaydı</CardTitle>
                                <CardDescription className="text-center font-medium mt-2">
                                    Ajans/Şirket olarak toplu ilan yönetin
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center pb-8">
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20">
                                    Ajans Aç
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                <div className="text-center mt-12 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-100">
                    <p className="text-gray-600 font-medium">
                        Zaten bir hesabınız var mı?{' '}
                        <Link href="/login" className="text-primary hover:underline font-black uppercase tracking-wider ml-1">
                            Giriş Yapın
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
