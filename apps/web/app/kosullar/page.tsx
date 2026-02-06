export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A] py-20 transition-colors">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">
                        Kullanım <span className="text-primary italic">Koşulları</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        VeloraEscortWorld platformunu kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.
                    </p>
                </div>

                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-12">
                    <section>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-4 mb-6">
                            1. Yaş Sınırı
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            Platformumuzu kullanabilmek için en az 18 yaşında olmanız gerekmektedir. Reşit olmayan kişilerin siteye girişi ve kullanımı kesinlikle yasaktır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-4 mb-6">
                            2. İçerik Sorumluluğu
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            VeloraEscortWorld bir ilan platformudur. İlan sahipleri tarafından paylaşılan metin, fotoğraf ve diğer içeriklerin doğruluğundan tamamen ilan sahibi sorumludur. Platformumuz bu içeriklerden dolayı hukuki sorumluluk kabul etmez.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-4 mb-6">
                            3. Yasaklı Faaliyetler
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            Diğer kullanıcıları taciz etmek, sahte profil oluşturmak, yasa dışı faaliyetlerin reklamını yapmak veya platformun teknik yapısına zarar verecek girişimlerde bulunmak kesinlikle yasaktır ve üyeliğin iptaline neden olur.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-4 mb-6">
                            4. Üyelik İptali
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            Platform yönetimimiz, kullanım koşullarını ihlal eden hesapları herhangi bir ön bildirimde bulunmaksızın askıya alma veya kalıcı olarak silme hakkını saklı tutar.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
