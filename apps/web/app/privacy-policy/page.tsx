import Link from 'next/link';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-4">Gizlilik Politikası</h1>
                    <p className="text-muted-foreground">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Giriş</h2>
                        <p>
                            Bu gizlilik politikası, platformumuzun kullanıcılarının kişisel verilerinin nasıl toplandığını,
                            kullanıldığını, saklandığını ve korunduğunu açıklamaktadır. Hizmetlerimizi kullanarak bu gizlilik
                            politikasını kabul etmiş olursunuz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Toplanan Bilgiler</h2>
                        <p>Platformumuz aşağıdaki bilgileri toplayabilir:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>E-posta adresi</li>
                            <li>Kullanıcı adı</li>
                            <li>Kullanıcı türü (Üye, Bağımsız Model, Ajans/Şirket)</li>
                            <li>Profil bilgileri (cinsiyet, işletme türü vb.)</li>
                            <li>İçerik ve iletişim bilgileri</li>
                            <li>Teknik veriler (IP adresi, tarayıcı türü, cihaz bilgisi)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Bilgilerin Kullanımı</h2>
                        <p>Topladığımız bilgiler aşağıdaki amaçlarla kullanılır:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Hesap oluşturma ve yönetimi</li>
                            <li>Hizmetlerimizi sağlama ve iyileştirme</li>
                            <li>Kullanıcı deneyimini kişiselleştirme</li>
                            <li>Güvenlik ve dolandırıcılık önleme</li>
                            <li>Yasal yükümlülükleri yerine getirme</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Veri Güvenliği</h2>
                        <p>
                            Kişisel verilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz.
                            Verileriniz şifrelenmiş bir şekilde saklanır ve yetkisiz erişime karşı korunur.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Üçüncü Taraflarla Paylaşım</h2>
                        <p>
                            Kişisel bilgileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz.
                            Hizmet sağlayıcılarımız (sunucu, ödeme işlemcileri vb.) ile sadece gerekli bilgiler paylaşılır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Çerezler</h2>
                        <p>
                            Platformumuz, kullanıcı deneyimini iyileştirmek için çerezler kullanır. Tarayıcı ayarlarınızdan
                            çerezleri yönetebilir veya devre dışı bırakabilirsiniz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">7. Kullanıcı Hakları</h2>
                        <p>Kullanıcılarımız aşağıdaki haklara sahiptir:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Kişisel verilerinize erişim</li>
                            <li>Verilerinizin düzeltilmesini talep etme</li>
                            <li>Verilerinizin silinmesini talep etme</li>
                            <li>Veri işlemeye itiraz etme</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">8. Değişiklikler</h2>
                        <p>
                            Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler olduğunda
                            kullanıcılarımızı bilgilendireceğiz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">9. İletişim</h2>
                        <p>
                            Gizlilik politikamız hakkında sorularınız varsa, lütfen bizimle iletişime geçin.
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
