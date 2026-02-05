import { createClient } from '@repo/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Clock } from 'lucide-react';
import { ProfileCard } from '../components/ProfileCard';
import { Button } from '@repo/ui';

export default async function IlanlarPage({
    searchParams,
}: {
    searchParams: { vitrin?: string; yeni?: string };
}) {
    const supabase = createClient();
    const isVitrinOnly = searchParams.vitrin === 'true';
    const isYeniOnly = searchParams.yeni === 'true';

    // Build query based on filters
    let query = supabase
        .from('listings')
        .select(`
            *,
            city:cities(id, name),
            category:categories(id, name),
            model_pricing(*)
        `)
        .eq('is_active', true);

    // Apply filters
    if (isVitrinOnly) {
        query = query.eq('is_featured', true);
    } else if (isYeniOnly) {
        // Sorted by created_at DESC is already handled below
        // No additional filter needed, just show all active in order
    }

    query = query.order('created_at', { ascending: false });

    const { data: listings, error } = await query;

    if (error) {
        console.error('Error fetching listings:', error);
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900 mb-4">Profiller Yüklenemedi</h2>
                    <p className="text-gray-600">Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
                </div>
            </div>
        );
    }

    // Separate featured and regular listings for default view
    const featuredListings = listings?.filter((l: any) => l.is_featured) || [];
    const regularListings = listings?.filter((l: any) => !l.is_featured) || [];

    let title = 'Tüm Profiller';
    let subtitle = 'Vitrin profiller ve diğer tüm profiller';

    if (isVitrinOnly) {
        title = 'Vitrin Profiller';
        subtitle = 'Editörlerimizin seçtiği en popüler profiller';
    } else if (isYeniOnly) {
        title = 'Yeni Eklenenler';
        subtitle = 'Platformda katılan en yeni üyeler';
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-12 md:py-16 border-b border-primary/20">
                <div className="container mx-auto px-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mb-4 text-white/90 hover:text-white hover:bg-white/10"
                        asChild
                    >
                        <Link href="/">
                            <ArrowLeft className="mr-1.5 h-4 w-4" /> Ana Sayfa
                        </Link>
                    </Button>

                    <div className="flex items-center gap-4 mb-4">
                        {isVitrinOnly ? (
                            <Sparkles className="h-10 w-10 md:h-12 md:w-12 animate-pulse" />
                        ) : (
                            <Clock className="h-10 w-10 md:h-12 md:w-12" />
                        )}
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter">
                                {title}
                            </h1>
                            <p className="text-white/90 mt-2 font-medium">{subtitle}</p>
                        </div>
                    </div>

                    {/* Filter Toggles */}
                    <div className="flex gap-2 mt-6">
                        <Link href="/ilanlar">
                            <Button
                                size="sm"
                                variant={!isVitrinOnly ? "secondary" : "ghost"}
                                className={!isVitrinOnly ? "bg-gold-gradient text-black font-bold border-none" : "text-white border-white/30 hover:bg-white/10"}
                            >
                                Tüm Profiller
                            </Button>
                        </Link>
                        <Link href="/ilanlar?vitrin=true">
                            <Button
                                size="sm"
                                variant={isVitrinOnly ? "secondary" : "ghost"}
                                className={isVitrinOnly ? "bg-gold-gradient text-black font-bold border-none" : "text-white border-white/30 hover:bg-white/10"}
                            >
                                <Sparkles className="h-3 w-3 mr-1.5" />
                                Sadece Vitrin
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Listings Grid */}
            <div className="container mx-auto px-4 py-12">
                {/* Unified view for "Yeni Eklenenler" filter */}
                {isYeniOnly ? (
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <Clock className="h-7 w-7 text-primary" />
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">
                                En Yeni İlanlar (Son 7 Gün)
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {listings?.map((listing: any) => (
                                <ProfileCard key={listing.id} listing={listing} translations={{}} />
                            ))}
                        </div>
                    </section>
                ) : (
                    <>
                        {!isVitrinOnly && featuredListings.length > 0 && (
                            <section className="mb-16">
                                <div className="flex items-center gap-3 mb-6">
                                    <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">
                                        Vitrin Profiller
                                    </h2>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {featuredListings.map((listing: any) => (
                                        <ProfileCard key={listing.id} listing={listing} isFeatured translations={{}} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {!isVitrinOnly && regularListings.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <Clock className="h-6 w-6 text-gray-600" />
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">
                                        Diğer Profiller
                                    </h2>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {regularListings.map((listing: any) => (
                                        <ProfileCard key={listing.id} listing={listing} translations={{}} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {isVitrinOnly && featuredListings.length > 0 && (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {featuredListings.map((listing: any) => (
                                    <ProfileCard key={listing.id} listing={listing} isFeatured translations={{}} />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {listings?.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold text-lg">Henüz profil bulunmuyor</p>
                    </div>
                )}
            </div>
        </div>
    );
}
