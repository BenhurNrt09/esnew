'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, useToast, Card, CardContent } from '@repo/ui';
import { Star, ShieldCheck, Heart, Info, Camera, Sparkles, Send, Calendar, Clock, MapPin, Smile, Zap, MessageCircle, LogIn, User } from 'lucide-react';
import Link from 'next/link';

interface AdvancedReviewFormProps {
    listingId: string;
    onSuccess?: () => void;
}

export function AdvancedReviewForm({ listingId, onSuccess }: AdvancedReviewFormProps) {
    const supabase = createClient();
    const toast = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState('');

    // Meeting Info
    const [meetingDate, setMeetingDate] = useState('');
    const [duration, setDuration] = useState('');
    const [city, setCity] = useState('');

    // Ratings (1-10)
    const [ratingAppearance, setRatingAppearance] = useState(10);
    const [ratingService, setRatingService] = useState(10);
    const [ratingCommunication, setRatingCommunication] = useState(10);

    // Detailed Service Options
    const [kissing, setKissing] = useState(''); // 'Dilli', 'Dilsiz'
    const [oralSex, setOralSex] = useState(''); // 'Kondomlu', 'Kondomsuz'
    const [comeInMouth, setComeInMouth] = useState(''); // 'Evet', 'Hayır', 'Ağıza' etc.
    const [sexLevel, setSexLevel] = useState(''); // 'Aktif', 'Pasif', 'Orta'
    const [analStatus, setAnalStatus] = useState(''); // 'Evet', 'Hayır'
    const [breastStatus, setBreastStatus] = useState(''); // 'Doğal', 'Silikon'
    const [sessions, setSessions] = useState(''); // 'Tek sefer', 'Birden fazla'
    const [ejaculation, setEjaculation] = useState(''); // 'Yüze', 'İçeri', 'Yutma'
    const [photoAccuracy, setPhotoAccuracy] = useState('');

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setIsAuthenticated(!!user);
            if (user) {
                setAuthorName(user.user_metadata?.username || user.email?.split('@')[0] || '');
            }
        };
        checkAuth();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Lütfen genel bir puan veriniz.');
            return;
        }

        if (!authorName.trim()) {
            toast.error('Lütfen isminizi belirtiniz.');
            return;
        }

        setSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase.from('comments').insert({
                listing_id: listingId,
                user_id: user?.id || null,
                author_name: authorName,
                content,
                rating_stars: rating,
                meeting_date: meetingDate || null,
                meeting_duration: duration || null,
                meeting_city: city || null,
                rating_appearance: ratingAppearance,
                rating_service: ratingService,
                rating_communication: ratingCommunication,
                kissing: kissing || null,
                oral_condom: oralSex || null,
                come_in_mouth: comeInMouth || null,
                sex_level: sexLevel || null,
                anal_status: analStatus === 'Evet',
                breast_natural: breastStatus === 'Doğal' ? 'natural' : 'silicone',
                multiple_sessions: sessions || null,
                ejaculation: ejaculation || null,
                photo_accuracy: photoAccuracy || null,
                is_approved: false // Always needs manual approval now
            });

            if (error) throw error;

            toast.success('Değerlendirmeleriniz gönderildi! Admin onayından sonra yayınlanacaktır.');
            resetForm();
            if (onSuccess) onSuccess();
        } catch (err: any) {
            toast.error('Hata: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setRating(0);
        setContent('');
        // Keep authorName if logged in
        setMeetingDate('');
        setDuration('');
        setCity('');
        setKissing('');
        setOralSex('');
        setComeInMouth('');
        setSexLevel('');
        setAnalStatus('');
        setSessions('');
        setEjaculation('');
        setPhotoAccuracy('');
    };

    const RatingSlider = ({ label, value, setter, icon: Icon }: any) => (
        <div className="space-y-4 bg-gray-50/50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5 group hover:border-primary/20 transition-all">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-white/10 group-hover:border-primary/40 transition-colors">
                        <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
                </div>
                <span className="bg-primary text-black text-xs font-black px-3 py-1 rounded-lg">{value}/10</span>
            </div>
            <input
                type="range" min="1" max="10" value={value}
                onChange={(e) => setter(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
        </div>
    );

    const OptionGrid = ({ label, options, current, setter }: any) => (
        <div className="space-y-3 md:space-y-4">
            <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{label}</label>
            {/* Mobile: Dropdown */}
            <select
                value={current || ''}
                onChange={(e) => setter(e.target.value)}
                className="md:hidden w-full px-4 py-3 rounded-xl text-xs font-black uppercase bg-white dark:bg-black border border-gray-100 dark:border-white/10 text-gray-900 dark:text-white focus:border-primary focus:outline-none"
            >
                <option value="">Seçiniz...</option>
                {options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            {/* Desktop: Buttons */}
            <div className="hidden md:flex flex-wrap gap-2">
                {options.map((opt: string) => (
                    <button
                        key={opt} type="button" onClick={() => setter(opt)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${current === opt
                            ? 'bg-gold-gradient text-black border-primary shadow-lg shadow-primary/20'
                            : 'bg-white dark:bg-black text-gray-400 border-gray-100 dark:border-white/10 hover:border-white/30 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );

    // Authenticated - show review form
    return (
        <Card className="shadow-2xl border-gray-100 dark:border-white/10 rounded-3xl overflow-hidden bg-white dark:bg-[#0A0A0A] mt-8 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-30" />
            <CardContent className="p-4 md:p-10 space-y-8 md:space-y-10 relative z-10">
                {/* Header & Main Rating */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 border-b border-gray-100 dark:border-white/5 pb-8 md:pb-10">
                    <div className="space-y-2">
                        <h3 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Deneyiminizi Detaylandırın</h3>
                        <p className="text-gray-500 font-medium text-xs md:text-base">Görüşleriniz topluluğumuz için çok değerlidir.</p>
                    </div>
                    <div className="flex items-center gap-2 md:gap-5 bg-gray-50 dark:bg-black/40 p-4 md:p-5 rounded-2xl md:rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-inner">
                        <span className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">GENEL PUAN</span>
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s} type="button" onClick={() => setRating(s)}
                                    className={`transition-all duration-300 ${s <= rating ? 'scale-125 text-primary drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]' : 'text-gray-200 dark:text-gray-800 hover:text-primary/30 hover:scale-110'}`}
                                >
                                    <Star className={`w-7 h-7 md:w-9 md:h-9 ${s <= rating ? 'fill-current' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Name & Meeting Context */}
                <div className="grid md:grid-cols-4 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" /> İsim / Rumuz
                        </label>
                        <Input
                            placeholder="İsminiz"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="h-14 rounded-2xl border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-gray-900 dark:text-white font-black"
                            disabled={isAuthenticated === true}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" /> Buluşma Tarihi
                        </label>
                        <Input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className="h-14 rounded-2xl border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-gray-900 dark:text-white font-black" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" /> Süre
                        </label>
                        <Input placeholder="Örn: 2 Saat" value={duration} onChange={(e) => setDuration(e.target.value)} className="h-14 rounded-2xl border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-gray-900 dark:text-white font-black placeholder:text-gray-300 dark:placeholder:text-gray-700" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" /> Şehir
                        </label>
                        <Input placeholder="Örn: İstanbul" value={city} onChange={(e) => setCity(e.target.value)} className="h-14 rounded-2xl border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-gray-900 dark:text-white font-black placeholder:text-gray-300 dark:placeholder:text-gray-700" />
                    </div>
                </div>

                {/* 1-10 Ratings */}
                <div className="grid md:grid-cols-3 gap-6">
                    <RatingSlider label="GÖRÜNTÜSÜ" value={ratingAppearance} setter={setRatingAppearance} icon={Smile} />
                    <RatingSlider label="SERVİSLER" value={ratingService} setter={setRatingService} icon={Zap} />
                    <RatingSlider label="İLETİŞİM" value={ratingCommunication} setter={setRatingCommunication} icon={MessageCircle} />
                </div>

                {/* Service Details Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 bg-gray-50 dark:bg-white/5 p-8 md:p-12 rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-inner">
                    <OptionGrid label="ÖPÜŞME" setter={setKissing} current={kissing} options={['Dilli', 'Dilsiz', 'Sadece Dudak', 'Hayır']} />
                    <OptionGrid label="ORAL SEKS" setter={setOralSex} current={oralSex} options={['Kondomlu', 'Kondomsuz', 'Derin']} />
                    <OptionGrid label="AĞIZA GELME" setter={setComeInMouth} current={comeInMouth} options={['Evet', 'Hayır', 'Ağıza', 'Yutma']} />
                    <OptionGrid label="SEKS" setter={setSexLevel} current={sexLevel} options={['Aktif', 'Pasif', 'Orta', 'Deneyim']} />
                    <OptionGrid label="ANAL" setter={setAnalStatus} current={analStatus} options={['Evet', 'Hayır']} />
                    <OptionGrid label="GÖĞÜS" setter={setBreastStatus} current={breastStatus} options={['Doğal', 'Silikon']} />
                    <OptionGrid label="TEK SEFERDE" setter={setSessions} current={sessions} options={['Tek sefer', 'Birden fazla', 'Sınırsız']} />
                    <OptionGrid label="BOŞALTMA" setter={setEjaculation} current={ejaculation} options={['Yüze', 'İçeri', 'Vücuda', 'Yutma']} />
                    <OptionGrid label="FOTOĞRAF" setter={setPhotoAccuracy} current={photoAccuracy} options={['Gerçek', '%10 PS', '%20 PS', 'AI / Filtre']} />
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">DENEYİM NOTUNUZ</label>
                    <textarea
                        value={content} onChange={(e) => setContent(e.target.value)}
                        placeholder="Modelin servisi, tavrı ve genel deneyiminiz hakkında detaylı bilgi verin..."
                        className="w-full h-48 bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-8 text-sm font-black text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-800"
                        required
                    />
                </div>

                <Button
                    onClick={handleSubmit} disabled={submitting}
                    className="w-full h-16 bg-gold-gradient text-black font-black uppercase tracking-[0.2em] text-sm rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    <Send className="w-5 h-5" /> {submitting ? 'GÖNDERİLİYOR...' : 'DEĞERLENDİRMEYİ YAYINLA'}
                </Button>
            </CardContent>
        </Card>
    );
}

