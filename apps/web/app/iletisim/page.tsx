import { Mail, Send, MapPin, Clock, MessageSquare } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A] py-20 transition-colors">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-6">
                        <MessageSquare className="w-4 h-4" /> Bize Ulaşın
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">
                        Size Nasıl Yardımcı <span className="text-primary italic">Olabiliriz?</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium max-w-xl mx-auto">
                        Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçmekten çekinmeyin. Ekibimiz size en kısa sürede dönüş yapacaktır.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl transition-transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wide mb-2">E-Posta</h3>
                            <p className="text-gray-500 font-bold text-sm mb-4">Genel sorular ve destek için:</p>
                            <a href="mailto:support@veloraescort.com" className="text-primary font-black text-base hover:underline">
                                support@veloraescort.com
                            </a>
                        </div>

                        <div className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl transition-transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                                <Send className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wide mb-2">Telegram</h3>
                            <p className="text-gray-500 font-bold text-sm mb-4">Hızlı iletişim ve güncellemeler:</p>
                            <a href="https://t.me/veloraofficial" target="_blank" rel="noopener noreferrer" className="text-primary font-black text-base hover:underline">
                                @veloraofficial
                            </a>
                        </div>

                        <div className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl transition-transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wide mb-2">Çalışma Saatleri</h3>
                            <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                                Destek ekibimiz Pazartesi - Cumartesi <br />
                                <span className="text-gray-900 dark:text-white font-black italic">09:00 - 20:00</span> saatleri arasında hizmet vermektedir.
                            </p>
                        </div>
                    </div>

                    {/* Contact Form Placeholder / Professional Message */}
                    <div className="lg:col-span-2 p-10 md:p-12 bg-[#111111] rounded-[3rem] shadow-2xl border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                            <MessageSquare className="w-64 h-64 text-white" />
                        </div>

                        <div className="relative z-10 space-y-8">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Kullanıcı <span className="text-primary italic">Desteği</span></h2>
                            <p className="text-gray-400 font-medium leading-relaxed">
                                VeloraEscortWorld olarak kullanıcılarımızın güvenliği ve memnuniyeti bizim için her şeyden daha önemlidir. İlanlarla ilgili şikayetlerinizi, platformdaki teknik hataları veya geliştirilmesini istediğiniz özellikleri bize bildirmekten çekinmeyin.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-white/5">
                                <div>
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">İlan Şikayetleri</h4>
                                    <p className="text-sm text-gray-500 font-medium">Sahte veya hatalı ilanları 'Profili Bildir' butonu üzerinden veya doğrudan e-posta ile bize iletebilirsiniz.</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Reklam Başvuruları</h4>
                                    <p className="text-sm text-gray-500 font-medium">Banner ve vitrin ilanları için Telegram kanalımız üzerinden reklam departmanımızla görüşebilirsiniz.</p>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center gap-4 text-xs font-black text-gray-600 uppercase tracking-widest leading-loose">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> DESTEK EKİBİ ŞU AN AKTİF
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
