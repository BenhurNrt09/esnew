import { createServerClient } from '@repo/lib/server';
import type { Listing, City, Category } from '@repo/types';
import { Button } from '@repo/ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
    MapPin, Calendar, Share2, Phone, CheckCircle2,
    User, Info, ArrowLeft, MessageCircle, Star,
    ShieldCheck, Zap, Sparkles, DollarSign, ListChecks,
    Heart, Globe, Smile, Languages, Shield, AlignRight, Clock
} from 'lucide-react';
import { formatPrice } from '@repo/lib';
import { cn } from '@repo/ui/src/lib/utils';
import { ProfileGallery } from '../../components/ProfileGallery';
import { AdvancedReviewForm } from '../../components/AdvancedReviewForm';
import { PublicProfileComments } from '../../components/PublicProfileComments';
import { StoryBalloons } from '../../components/StoryBalloons';
import { ListingChatActions } from '../../components/ListingChatActions';

export const revalidate = 0;

interface ExtendedListing extends Listing {
    city?: City;
    category?: Category;
    images?: string[];
    cover_image?: string;
    phone?: string;
    phone_country_code?: string;
    metadata: any;
    pricing?: any[];
    gender?: string;
    orientation?: string;
    ethnicity?: string;
    nationality?: string;
    tattoos?: boolean;
    smoking?: boolean;
    alcohol?: boolean;
    breast_size?: string;
    body_hair?: string;
    age_value?: number;
    height?: string;
    weight?: string;
    languages?: any;
    services?: any;
    badges?: string[];
    listing_stats?: any[];
    is_verified?: boolean;
    rating_average?: number;
    review_count?: number;
}

async function getListing(slug: string): Promise<ExtendedListing | null> {
    const supabase = createServerClient();
    const { data: listing, error } = await supabase
        .from('listings')
        .select('*, city:cities(*), category:categories(*), listing_stats(view_count, contact_count)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error || !listing) return null;

    const { data: pricing } = await supabase
        .from('model_pricing')
        .select('*')
        .eq('listing_id', listing.id)
        .order('created_at', { ascending: true });

    // Normalize pricing: merge incall_price/outcall_price/price into a single effective_price
    const normalizedPricing = (pricing || []).map(p => ({
        ...p,
        price: p.price ?? p.incall_price ?? p.outcall_price ?? null,
        incall_price: p.incall_price ?? p.price ?? null,
        outcall_price: p.outcall_price ?? null,
    }));

    return { ...listing, pricing: normalizedPricing };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const listing = await getListing(params.slug);
    if (!listing) return { title: 'Profil Bulunamadı | VeloraEscortWorld' };

    const cityName = listing.city?.name || 'Türkiye';
    const categoryName = listing.category?.name || 'Escort';

    return {
        title: `${listing.title} | ${cityName} ${categoryName} | VeloraEscortWorld`,
        description: listing.description?.substring(0, 160),
        openGraph: {
            title: `${listing.title} - ${cityName}`,
            description: listing.description?.substring(0, 160),
            images: listing.cover_image ? [listing.cover_image] : [],
        },
        alternates: {
            canonical: `/ilan/${listing.slug}`,
        }
    };
}

export default async function ListingPage({ params }: { params: { slug: string } }) {
    const listing = await getListing(params.slug);
    if (!listing) notFound();

    const gallery = listing.images || [];
    const allImages = listing.cover_image ? [listing.cover_image, ...gallery] : gallery;
    const meta = listing.metadata || {};

    const orientationLabels: Record<string, string> = {
        'straight': 'Heteroseksüel',
        'bisexual': 'Biseksüel',
        'lesbian': 'Lezbiyen',
        'gay': 'Gey',
        'fetish': 'Fetişist'
    };

    const bodyHairLabels: Record<string, string> = {
        'trasli': 'Tıraşlı',
        'degil': 'Doğal',
        'arasira': 'Bakımlı'
    };

    const getOrientationDisplay = (val: any) => {
        const values = Array.isArray(val) ? val : [val];
        const translated = values.map(v => orientationLabels[v] || v);

        if (translated.length <= 1) return translated[0] || 'Hetero';

        return (
            <div className="flex flex-col items-end gap-0">
                {translated.map((t, idx) => (
                    <span key={idx} className="text-[9px] leading-tight">{t}</span>
                ))}
            </div>
        );
    };

    const features = [
        { label: 'Cinsiyet', value: listing.gender || 'Kadın', icon: <User className="w-4 h-4" /> },
        { label: 'Yaş', value: listing.age_value || '-', icon: <Calendar className="w-4 h-4" /> },
        { label: 'Boy', value: listing.height ? `${listing.height} cm` : '-', icon: <ArrowLeft className="w-4 h-4 rotate-90" /> },
        { label: 'Kilo', value: listing.weight ? `${listing.weight} kg` : '-', icon: <Zap className="w-4 h-4" /> },
        { label: 'Göğüs', value: listing.breast_size || '-', icon: <Heart className="w-4 h-4" /> },
        { label: 'Etnik Köken', value: listing.ethnicity || 'Avrupalı', icon: <Globe className="w-4 h-4" /> },
        { label: 'Yönelim', value: getOrientationDisplay(listing.orientation), icon: <Smile className="w-4 h-4" /> },
        { label: 'Uyruk', value: listing.nationality || '-', icon: <Shield className="w-4 h-4" /> },
        { label: 'Dövme', value: listing.tattoos ? 'Evet' : 'Hayır', icon: <Sparkles className="w-4 h-4" /> },
        { label: 'Vücut Kılı', value: bodyHairLabels[listing.body_hair || ''] || 'Doğal', icon: <Sparkles className="w-4 h-4" /> },
        { label: 'Sigara', value: listing.smoking ? 'Evet' : 'Hayır', icon: <Info className="w-4 h-4" /> },
        { label: 'Alkol', value: listing.alcohol ? 'Evet' : 'Hayır', icon: <Info className="w-4 h-4" /> },
    ];

    const servicesData = listing.services || meta.services || {};
    const services = Object.entries(servicesData)
        .filter(([_, active]) => active)
        .map(([id]) => ({
            id,
            label: id.replace(/_/g, ' ').toLocaleUpperCase('tr-TR'),
            allowed: true
        }));

    const currencySymbols: Record<string, string> = { 'TRY': '₺', 'USD': '$', 'EUR': '€' };

    const badgeColors: Record<string, string> = {
        'VIP': 'bg-amber-500 text-white',
        'YENİ': 'bg-green-500 text-white',
        'PREMIUM': 'bg-blue-600 text-white',
        'BAĞIMSIZ': 'bg-purple-600 text-white',
        'VİDEOLU': 'bg-primary text-black',
        'PORNO YILDIZI': 'bg-gray-900 text-white'
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
            {/* COMPACT HERO */}
            <div className="relative h-[200px] sm:h-[250px] w-full bg-black overflow-hidden group border-b border-primary/30">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black/90"></div>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                {/* Floating Back Button */}
                <div className="absolute top-4 left-4 z-30">
                    <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full h-8 px-3 backdrop-blur-md border border-white/10 text-[10px]" asChild>
                        <Link href="/">
                            <ArrowLeft className="mr-1 h-3 w-3" /> Tüm İlanlar
                        </Link>
                    </Button>
                </div>

                {/* Floating Badges - Positioned below the back button with a safe margin */}
                <div className="absolute top-16 left-4 z-20 flex flex-wrap gap-1 max-w-[200px]">
                    {/* No extra badges here, keeping it clean as requested */}
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 z-20">
                    <div className="container mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    {listing.is_verified && (
                                        <span className="bg-gold-gradient backdrop-blur-md text-black px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-primary/20 border border-primary/30">
                                            <ShieldCheck className="w-3 h-3 text-black" /> Kimlik Doğrulanmış
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter leading-none drop-shadow-2xl capitalize">
                                    {listing.title}
                                </h1>
                                <div className="flex items-center gap-3 text-white/50 text-xs font-bold uppercase tracking-wide">
                                    <span className="flex items-center gap-1.5 text-primary">
                                        <MapPin className="h-3.5 w-3.5 text-primary" /> {listing.city?.name}
                                    </span>
                                    <span className="w-1 h-1 bg-primary/20 rounded-full"></span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-primary" /> {new Date(listing.created_at).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <ListingChatActions
                                    receiverId={listing.user_id}
                                    receiverName={listing.title}
                                />
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white gap-2 rounded-full h-10 sm:h-11 px-4 sm:px-6 shadow-xl shadow-green-900/40 text-xs sm:text-sm font-black uppercase tracking-wide transition-all hover:scale-105 active:scale-95 group"
                                    asChild
                                >
                                    <a href={`https://wa.me/${listing.phone?.replace(/\\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="h-4 w-4 group-hover:rotate-12 transition-transform" /> WHATSAPP
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Cover Photo + Profile Summary Layout - Mobile: Side by Side */}
                        <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-6">
                            {/* Cover Photo - Smaller on Mobile */}
                            <div className="col-span-1 md:col-span-4">
                                <div className="bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/10 p-2 md:p-3 rounded-xl md:rounded-2xl shadow-xl dark:shadow-2xl">
                                    <div className="aspect-[3/4] rounded-lg md:rounded-xl overflow-hidden ring-1 ring-white/10">
                                        <img
                                            src={listing.cover_image || allImages[0]}
                                            alt={listing.title}
                                            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>

                                    <div className="mt-4 flex flex-col items-center gap-1">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className={cn(
                                                        "w-4 h-4",
                                                        s <= Math.round(listing.rating_average || 0)
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-300 dark:text-gray-800"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        {listing.rating_average && listing.rating_average > 0 ? (
                                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
                                                Ortalama: {Number(listing.rating_average).toFixed(1)} / 5.0 ({listing.review_count} Yorum)
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
                                                Henüz Puanlanmamış
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Profile Summary - Compact on Mobile */}
                            <div className="col-span-1 md:col-span-8">
                                <div className="bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/10 rounded-xl md:rounded-2xl p-4 md:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden backdrop-blur-xl">
                                    <div className="hidden md:block absolute top-0 right-0 p-8 opacity-5">
                                        <User className="w-32 h-32 text-primary" />
                                    </div>
                                    <h2 className="text-sm md:text-2xl font-black text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3 uppercase tracking-tighter relative z-10">
                                        <User className="h-5 w-5 md:h-7 md:w-7 text-primary" /> <span className="hidden sm:inline">PROFİL</span> ÖZETİ
                                    </h2>
                                    <div className="w-12 h-1 bg-gold-gradient rounded-full mb-6 relative z-10" />
                                    <div className="max-h-[300px] md:max-h-[450px] overflow-y-auto pr-4 custom-scrollbar relative z-10">
                                        <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm lg:text-lg font-medium leading-loose whitespace-pre-line italic">
                                            "{listing.description}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Stories for this profile */}
                        <div className="mb-4">
                            <StoryBalloons modelId={listing.user_id} />
                        </div>

                        {/* Gallery */}
                        <ProfileGallery images={allImages} />

                        {/* Mobile: Show Sidebar Sections Here (Features, Pricing, Services) */}
                        <div className="lg:hidden space-y-4">
                            {/* Features */}
                            <div className="bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 rounded-2xl p-4 shadow-xl">
                                <h3 className="text-base font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-tighter">
                                    <Info className="h-4 w-4 text-primary" /> ÖZELLİKLER
                                </h3>
                                <div className="space-y-2">
                                    {features.map((f, i) => (
                                        <div key={i} className="flex justify-between items-center py-2.5 border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 px-2 rounded-lg transition-all">
                                            <div className="flex items-center gap-2">
                                                <span className="p-1.5 bg-gray-100 dark:bg-black/40 rounded-lg text-primary/40">{f.icon}</span>
                                                <span className="text-gray-400 dark:text-gray-500 font-bold text-[10px] uppercase tracking-wide">{f.label}</span>
                                            </div>
                                            <span className="text-gray-900 dark:text-white font-black text-xs">{f.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="bg-white dark:bg-[#0A0A0A] border border-primary/20 rounded-2xl p-4 shadow-lg dark:shadow-xl">
                                <h3 className="text-base font-black text-primary dark:text-gold-gradient mb-4 flex items-center gap-2 uppercase tracking-tighter">
                                    <DollarSign className="h-4 w-4 text-primary" /> FİYATLANDIRMA
                                </h3>
                                <div className="space-y-3">
                                    {listing.pricing && listing.pricing.length > 0 ? (
                                        listing.pricing.map((p, i) => (
                                            <div key={i} className="flex justify-between items-center bg-gray-50 dark:bg-black/40 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-primary uppercase tracking-wide">{p.duration}</p>
                                                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-[9px] font-bold uppercase">
                                                        <MapPin className="w-2.5 h-2.5" /> {p.location || 'Her Yer'}
                                                    </div>
                                                </div>
                                                <div className="text-base font-black text-gray-900 dark:text-white">
                                                    {currencySymbols[p.currency || 'TRY']} {p.price}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center bg-black/20 rounded-xl border border-dashed border-white/10 text-gray-600 font-bold uppercase text-[9px]">Fiyat Belirtilmemiş</div>
                                    )}
                                </div>
                            </div>

                            {/* Services */}
                            <div className="bg-white dark:bg-card/20 dark:border-white/10 rounded-2xl p-4 shadow-lg border border-gray-100">
                                <h3 className="text-base font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2 uppercase tracking-tighter">
                                    <ListChecks className="h-4 w-4 text-primary" /> NELER VAR?
                                </h3>
                                <div className="grid grid-cols-1 gap-1.5">
                                    {services.length > 0 ? (
                                        services.map((s, i) => (
                                            <div key={i} className="flex items-center gap-2 bg-green-50/50 p-2 rounded-lg border border-green-100/50">
                                                <div className="w-4 h-4 rounded-md bg-green-500 flex items-center justify-center text-white shadow-sm">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                </div>
                                                <span className="text-[9px] font-black text-green-950 tracking-wide uppercase">{s.label}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-6 text-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-bold uppercase text-[9px]">Hizmet Belirtilmemiş</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ADVANCED REVIEW SYSTEM */}
                        <div id="reviews" className="space-y-6">
                            <PublicProfileComments listingId={listing.id} />
                            <AdvancedReviewForm listingId={listing.id} />
                        </div>
                    </div>

                    {/* Sidebar Area - ONLY DESKTOP */}
                    <div className="hidden lg:block lg:col-span-4 space-y-4">

                        {/* 1. ÖZELLİKLER TABLE */}
                        <div className="bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-xl dark:shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tighter relative z-10">
                                <Info className="h-5 w-5 text-primary" /> ÖZELLİKLER
                            </h3>
                            <div className="space-y-2 relative z-10">
                                {features.map((f, i) => (
                                    <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 px-2 rounded-xl transition-all">
                                        <div className="flex items-center gap-3">
                                            <span className="p-2 bg-gray-100 dark:bg-black/40 rounded-xl text-primary/40 group-hover:text-primary transition-colors">{f.icon}</span>
                                            <span className="text-gray-400 dark:text-gray-500 font-bold text-[10px] uppercase tracking-widest">{f.label}</span>
                                        </div>
                                        <span className="text-gray-900 dark:text-white font-black text-xs">{f.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. DİLLER TABLE */}
                        {listing.languages && (listing.languages as any[]).length > 0 && (
                            <div className="bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-xl dark:shadow-2xl relative overflow-hidden group">
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tighter relative z-10">
                                    <Languages className="h-5 w-5 text-primary" /> DİLLER
                                </h3>
                                <div className="space-y-3 relative z-10">
                                    {(listing.languages as any[]).map((lang, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5 last:border-0">
                                            <span className="text-gray-900 dark:text-white font-black text-xs uppercase tracking-widest">{lang.lang}</span>
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star
                                                        key={star}
                                                        className={cn(
                                                            "w-3 h-3",
                                                            star <= lang.level ? "text-yellow-400 fill-yellow-400" : "text-gray-200 dark:text-gray-800"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. FİYATLANDIRMA TABLE */}
                        <div className="bg-white dark:bg-[#0A0A0A] border border-primary/20 dark:border-primary/30 rounded-2xl p-6 shadow-xl dark:shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                <DollarSign className="w-24 h-24 text-primary" />
                            </div>
                            <h3 className="text-lg font-black text-primary dark:text-gold-gradient mb-6 flex items-center gap-2 uppercase tracking-tighter relative z-10">
                                <DollarSign className="h-5 w-5 text-primary" /> FİYATLANDIRMA
                            </h3>
                            <div className="space-y-4 relative z-10">
                                {listing.pricing && listing.pricing.length > 0 ? (
                                    listing.pricing.map((p, i) => (
                                        <div key={i} className="flex justify-between items-center bg-gray-50 dark:bg-black/40 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-primary/20 hover:scale-[1.02] transition-all duration-300 group/item">
                                            <div>
                                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" /> {p.duration}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase">
                                                    <MapPin className="w-3.5 h-3.5" /> {p.location || 'Her Yer'}
                                                </div>
                                            </div>
                                            <div className="text-xl font-black text-gray-900 dark:text-white bg-white/60 dark:bg-black/60 px-4 py-2 rounded-xl border border-gray-100 dark:border-white/5 shadow-inner min-w-[100px] text-center group-hover/item:text-primary transition-colors">
                                                {currencySymbols[p.currency || 'TRY']} {p.price !== null && p.price !== undefined ? p.price : '-'}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center bg-gray-50 dark:bg-black/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-600 font-bold uppercase text-[10px] flex flex-col items-center gap-2">
                                        <DollarSign className="w-8 h-8 opacity-20" />
                                        Fiyat Belirtilmemiş
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. İZİNLER / NELER VAR TABLE */}
                        <div className="bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl group">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tighter">
                                <ListChecks className="h-5 w-5 text-primary" /> NELER VAR?
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {services.length > 0 ? (
                                    services.map((s, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-50 dark:border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all group/item">
                                            <div className="w-5 h-5 rounded-lg bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-500 shadow-xl group-hover/item:bg-green-500 group-hover/item:text-black transition-colors">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-600 dark:text-gray-300 tracking-widest uppercase group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{s.label}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center bg-gray-50 dark:bg-black/20 rounded-2xl border-2 border-dashed border-gray-100 dark:border-white/10 text-gray-400 dark:text-gray-600 font-bold uppercase text-[9px]">Hizmet Belirtilmemiş</div>
                                )}
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="bg-gray-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10 space-y-3">
                                <p className="text-red-500 font-black uppercase tracking-wider text-[10px] flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-primary" /> GÜVENLİK PROTOKOLÜ
                                </p>
                                <p className="text-gray-400 text-[10px] font-bold leading-relaxed">
                                    VeloraEscortWorld sadece dijital bir rehberdir. Modellerle yapacağınız görüşmelerde kişisel güvenliğiniz için onaylı profilleri tercih ediniz.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Person",
                        "name": listing.title,
                        "description": listing.description,
                        "image": listing.cover_image,
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": listing.city?.name,
                            "addressCountry": "TR"
                        },
                        "url": `https://veloraescortworld.com/ilan/${listing.slug}`,
                        "jobTitle": "Independent Model",
                        "gender": listing.gender === 'man' ? 'Male' : 'Female'
                    })
                }}
            />
        </div>
    );
}

function AlertCircle(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
}
