'use client';

import Link from 'next/link';
import { useLanguage } from '@repo/lib/i18n';

export default function TermsOfServicePage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-4">{t.legal.generalTerms}</h1>
                    <p className="text-muted-foreground">{t.legal.lastUpdated} {new Date().toLocaleDateString('tr-TR')}</p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">{t.legal.section1}</h2>
                        <p>
                            {t.legal.serviceDefinition}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">{t.legal.section2}</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>{t.legal.accountCreation}</li>
                            <li>{t.legal.provideAccurateInfo}</li>
                            <li>{t.legal.accountSecurity}</li>
                            <li>{t.legal.oneAccountPerUser}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">{t.legal.section3}</h2>
                        <p>{t.legal.userResponsibilities}</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>{t.legal.obeyLaws}</li>
                            <li>{t.legal.shareHonestInfo}</li>
                            <li>{t.legal.respectOthers}</li>
                            <li>{t.legal.respectIntellectualProperty}</li>
                            <li>{t.legal.dontAbuseService}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">{t.legal.section4}</h2>
                        <p>{t.legal.prohibitedBehaviors}</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>{t.legal.noFalseContent}</li>
                            <li>{t.legal.noSpam}</li>
                            <li>{t.legal.noHarassment}</li>
                            <li>{t.legal.noSecurityThreats}</li>
                            <li>{t.legal.noIllegalActivity}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">{t.legal.section5}</h2>
                        <p>
                            {t.legal.contentOwnership}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">{t.legal.section6}</h2>
                        <p>
                            {t.legal.accountTermination}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">{t.legal.section7}</h2>
                        <p>
                            {t.legal.disclaimer}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">{t.legal.section8}</h2>
                        <p>
                            {t.legal.termsChanges}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">{t.legal.section9}</h2>
                        <p>
                            {t.legal.feesPayments}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">{t.legal.section10}</h2>
                        <p>
                            {t.legal.contact}
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
