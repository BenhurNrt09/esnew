import Link from 'next/link';

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-4">Genel Hizmet Şartları</h1>
                    <p className="text-muted-foreground">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Hizmet Tanımı</h2>
                        <p>
                            Platformumuz, üyeler, bağımsız modeller ve ajanslar/şirketler için bir buluşma ve
                            tanıtım platformudur. Hizmetlerimizi kullanarak bu şartları kabul etmiş olursunuz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Hesap Oluşturma</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>18 yaşından büyük olmanız gerekmektedir</li>
                            <li>Doğru ve güncel bilgiler sağlamalısınız</li>
                            <li>Hesap güvenliğinden siz sorumlusunuz</li>
                            <li>Her kullanıcı yalnızca bir hesap oluşturabilir</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Kullanıcı Sorumlulukları</h2>
                        <p>Kullanıcılar aşağıdaki kurallara uymayı kabul eder:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Yasalara ve yönetmeliklere uygun davranmak</li>
                            <li>Doğru ve yanıltıcı olmayan bilgiler paylaşmak</li>
                            <li>Diğer kullanıcılara saygılı davranmak</li>
                            <li>Telif haklarına ve fikri mülkiyet haklarına saygı göstermek</li>
                            <li>Platformu kötüye kullanmamak</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Yasak Davranışlar</h2>
                        <p>Aşağıdaki davranışlar kesinlikle yasaktır:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Sahte veya yanıltıcı içerik paylaşmak</li>
                            <li>Spam veya istenmeyen mesajlar göndermek</li>
                            <li>Başkalarını taciz etmek veya tehdit etmek</li>
                            <li>Platformun güvenliğini tehlikeye atmak</li>
                            <li>Yasadışı faaliyetlerde bulunmak</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. İçerik Sahipliği</h2>
                        <p>
                            Platformda paylaştığınız içeriklerin telif hakları size aittir. Ancak, içeriğinizi
                            platformumuzda göstermek için bize sınırlı bir lisans vermiş olursunuz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Hesap Askıya Alma ve Sonlandırma</h2>
                        <p>
                            Şartları ihlal eden hesapları uyarı vermeden askıya alabilir veya sonlandırabiliriz.
                            Kullanıcılar istedikleri zaman hesaplarını kapatabilirler.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">7. Sorumluluk Reddi</h2>
                        <p>
                            Platform "olduğu gibi" sağlanmaktadır. Kullanıcılar arasındaki etkileşimlerden,
                            içeriklerden veya hizmet kesintilerinden sorumlu değiliz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">8. Değişiklikler</h2>
                        <p>
                            Bu şartlar zaman zaman güncellenebilir. Önemli değişiklikler yapıldığında
                            kullanıcılar bilgilendirilecektir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">9. Ücretler ve Ödemeler</h2>
                        <p>
                            Bazı hizmetler ücretli olabilir. Ücretler ve ödeme koşulları ilgili sayfalarda
                            belirtilecektir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">10. İletişim</h2>
                        <p>
                            Hizmet şartlarımız hakkında sorularınız varsa, lütfen bizimle iletişime geçin.
                        </p>
                    </section>

                    <section className="mt-8 p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm">
                            <strong>Not:</strong> Bu platformu kullanarak, 18 yaşından büyük olduğunuzu ve
                            yukarıdaki tüm şartları okuduğunuzu ve kabul ettiğinizi beyan edersiniz.
                        </p>
                    </section>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/" className="text-primary hover:underline font-medium">
                        ← Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        </div>
    );
}
