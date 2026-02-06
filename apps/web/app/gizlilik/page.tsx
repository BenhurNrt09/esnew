export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A] py-20 transition-colors">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">
                        Gizlilik <span className="text-primary italic">Politikası</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        Son güncelleme: 6 Şubat 2026
                    </p>
                </div>

                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-12">
                    <section>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-4 mb-6">
                            1. Veri Toplama
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            VeloraEscortWorld olarak, kullanıcılarımıza daha iyi hizmet sunabilmek adına belirli kişisel bilgileri topluyoruz. Bu bilgiler arasında ad, e-posta adresi, profil fotoğrafları ve hizmet tercihleriniz yer alabilir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-4 mb-6">
                            2. Veri Kullanımı
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            Topladığımız veriler, platformun işlevselliğini artırmak, kullanıcı güvenliğini sağlamak ve size özel içerikler sunmak amacıyla kullanılır. Kişisel verileriniz asla izniniz dışında üçüncü taraflarla paylaşılmaz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-4 mb-6">
                            3. Çerez Politikası
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            Sitemizde kullanıcı deneyimini iyileştirmek için çerezler (cookies) kullanılmaktadır. Tarayıcı ayarlarınızdan çerez kullanımını kısıtlayabilirsiniz, ancak bu durum sitemizin bazı özelliklerinin çalışmamasına neden olabilir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-4 mb-6">
                            4. Güvenlik
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            Verilerinizin güvenliği profesyonel sistemlerle korunmaktadır. Ancak internet üzerinden yapılan hiçbir veri iletiminin %100 güvenli olduğu garanti edilemez.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
