'use client';

import Link from 'next/link';
import { Twitter, Instagram, Send, Mail, MapPin, Phone, ShieldCheck, Zap, Star } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-white dark:bg-[#080808] border-t border-gray-100 dark:border-white/5 pt-20 pb-10 transition-colors">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                <Star className="w-6 h-6 text-black" fill="currentColor" />
                            </div>
                            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">VELORA<span className="text-primary">ESCORTWORLD</span></span>
                        </Link>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed">
                            Türkiye'nin en seçkin ve profesyonel ilan platformu. Güvenilir, şeffaf ve kaliteli hizmet anlayışıyla sektörün lider adresi.
                        </p>
                    </div>



                    {/* Support */}
                    <div>
                        <h4 className="text-gray-900 dark:text-white font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-primary" /> DESTEK & GÜVENLİK
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Sıkça Sorulanlar', href: '/sss' },
                                { label: 'Güvenlik Rehberi', href: '/guvenlik' },
                                { label: 'Kullanım Koşulları', href: '/kosullar' },
                                { label: 'Gizlilik Politikası', href: '/gizlilik' },
                                { label: 'İletişim', href: '/iletisim' },
                                { label: 'Canlı Destek', href: '/destek' }
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-gray-500 hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full group-hover:bg-primary transition-colors"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-gray-900 dark:text-white font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" /> İLETİŞİM
                        </h4>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-1">E-POSTA</p>
                                    <p className="text-sm font-black text-gray-900 dark:text-white">support@veloraescort.com</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Send className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-1">TELEGRAM</p>
                                    <p className="text-sm font-black text-gray-900 dark:text-white">@veloraofficial</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEO Text Section */}
                <div className="border-t border-gray-100 dark:border-white/5 py-12">
                    <div className="max-w-4xl">
                        <h5 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-6 underline decoration-primary underline-offset-8 decoration-2">Premium Escort İlan Platformu</h5>
                        <p className="text-gray-400 dark:text-gray-500 text-[11px] leading-loose font-medium italic mb-6">
                            VeloraEscortWorld, Türkiye genelindeki en seçkin ve profesyonel bağımsız modellerin bir araya geldiği, kullanıcılarına en yüksek kalitede deneyim sunmayı hedefleyen öncü bir ilan platformudur. İstanbul escort, Ankara escort, İzmir escort ve diğer tüm şehirlerdeki en güncel ilanlara ulaşmanızı sağlar. Platformumuzda yer alan tüm profiller titizlikle incelenmekte ve kullanıcı yorumları ile desteklenmektedir. Güvenli, şeffaf ve yüksek standartlı bir hizmet için doğru adrestesiniz.
                        </p>
                        <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-2xl">
                            <h6 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> YASAL UYARI & SORUMLULUK REDDİ
                            </h6>
                            <p className="text-[10px] text-gray-500 dark:text-gray-600 leading-relaxed font-bold uppercase tracking-wider">
                                VELORAESCORTWORLD SADECE BİR REKLAM VE İLAN SİTESİDİR. BİR ESKORT AJANSI, ARACI KURUM VEYA ORGANİZASYON DEĞİLDİR. SİTEMİZDE YER ALAN TÜM İÇERİKLER, İLAN SAHİPLERİ TARAFINDAN OLUŞTURULMAKTADIR. YAYINLANAN İLANLARIN İÇERİĞİNDEN, DOĞRULUĞUNDAN VE YAPILAN GÖRÜŞMELERDEN DOĞABİLECEK HİÇBİR OLUMSUZLUKTAN SİTEMİZ SORUMLU TUTULAMAZ. KULLANICILARIMIZIN KENDİ GÜVENLİKLERİ İÇİN GEREKLİ TİTİZLİĞİ GÖSTERMESİ ÖNEMLE RİCA OLUNUR.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 dark:border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-400 dark:text-gray-600 font-black text-[10px] uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} VELORA ESCORT WORLD. TÜM HAKLARI SAKLIDIR.
                    </p>
                    <div className="flex items-center gap-8">
                        <p className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4 text-green-500" /> +18 ADULT CONTENT
                        </p>
                        <div className="w-px h-4 bg-gray-100 dark:bg-white/10 hidden md:block"></div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">
                            DESIGNED WITH <span className="text-red-500">❤</span> BY VELORA
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
