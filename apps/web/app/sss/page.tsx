'use client';

import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const faqData = [
    {
        question: "VeloraEscortWorld nedir?",
        answer: "VeloraEscortWorld, Türkiye genelindeki bağımsız modellerin kendilerini tanıtabileceği ve kullanıcıların bu profillere güvenli bir şekilde ulaşabileceği profesyonel bir ilan platformudur."
    },
    {
        question: "Nasıl ilan verebilirim?",
        answer: "Kayıt ol sayfasından 'Model' olarak üyelik oluşturduktan sonra, profilinizi tamamlayıp ilanınızı yayına alabilirsiniz. Admin onayından sonra ilanınız görünür olacaktır."
    },
    {
        question: "Ücretlendirme nasıldır?",
        answer: "Platformumuzda farklı ilan paketleri ve öne çıkarma seçenekleri bulunmaktadır. Detaylı bilgi için üye panelinizdeki 'Paketler' bölümünü ziyaret edebilirsiniz."
    },
    {
        question: "Güvenlik nasıl sağlanıyor?",
        answer: "Tüm profiller manuel onay sürecinden geçer. Ayrıca kullanıcı yorumları ve şikayet mekanizmaları ile topluluk denetimi sağlanmaktadır."
    },
    {
        question: "Canlı Chat özelliği ücretli mi?",
        answer: "Canlı Chat özelliği kayıtlı kullanıcılar için ücretsizdir. Modeller ile gerçek zamanlı olarak iletişim kurabilirsiniz."
    }
];

export default function SSSPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A] py-20 transition-colors">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-6">
                        <HelpCircle className="w-4 h-4" /> Yardım Merkezi
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">
                        Sıkça Sorulan <span className="text-primary italic">Sorular</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        Platformumuz hakkında en çok merak edilen soruları ve cevaplarını aşağıda bulabilirsiniz.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden transition-all"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="text-sm md:text-base font-black text-gray-900 dark:text-white uppercase tracking-wide">
                                    {item.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-primary" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                        {item.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-20 p-8 bg-gold-gradient rounded-3xl text-center shadow-2xl shadow-primary/20">
                    <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-4">Başka bir sorunuz mu var?</h3>
                    <p className="text-black/80 font-bold mb-8">Müşteri hizmetlerimiz size yardımcı olmaktan mutluluk duyacaktır.</p>
                    <a
                        href="/iletisim"
                        className="inline-block px-10 py-4 bg-black text-white rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
                    >
                        Bize Ulaşın
                    </a>
                </div>
            </div>
        </div>
    );
}
