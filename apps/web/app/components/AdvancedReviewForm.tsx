'use client';

import { useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, useToast, Card, CardContent } from '@repo/ui';
import { Star, ShieldCheck, Heart, Info, Camera, Sparkles, Send, Calendar, Clock, MapPin, Smile, Zap, MessageCircle } from 'lucide-react';

interface AdvancedReviewFormProps {
    listingId: string;
    onSuccess?: () => void;
}

export function AdvancedReviewForm({ listingId, onSuccess }: AdvancedReviewFormProps) {
    const supabase = createClient();
    const toast = useToast();
    const [submitting, setSubmitting] = useState(false);

    // Core
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Lütfen genel bir puan veriniz.');
            return;
        }

        setSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Değerlendirme yapmak için giriş yapmalısınız.');

            const { error } = await supabase.from('comments').insert({
                listing_id: listingId,
                user_id: user.id,
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
                is_approved: true
            });

            if (error) throw error;

            toast.success('Değerlendirmeniz başarıyla gönderildi!');
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
        <div className="space-y-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                        <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
                </div>
                <span className="bg-primary text-white text-xs font-black px-3 py-1 rounded-lg">{value}/10</span>
            </div>
            <input
                type="range" min="1" max="10" value={value}
                onChange={(e) => setter(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
        </div>
    );

    const OptionGrid = ({ label, options, current, setter }: any) => (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            <div className="flex flex-wrap gap-2">
                {options.map((opt: string) => (
                    <button
                        key={opt} type="button" onClick={() => setter(opt)}
                        className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${current === opt
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                : 'bg-white text-gray-500 border-gray-100 hover:border-primary/30'
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <Card className="shadow-2xl shadow-primary/5 border-gray-100 rounded-[3rem] overflow-hidden bg-white mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <CardContent className="p-10 space-y-12">
                {/* Header & Main Rating */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-gray-50 pb-10">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Deneyiminizi Detaylandırın</h3>
                        <p className="text-gray-500 font-bold text-sm">Görüşleriniz diğer kullanıcılar için rehber niteliğindedir.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-[2rem] border border-gray-100">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">GENEL PUAN</span>
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s} type="button" onClick={() => setRating(s)}
                                    className={`transition-all ${s <= rating ? 'scale-110 text-yellow-400' : 'text-gray-200 hover:text-yellow-200 hover:scale-110'}`}
                                >
                                    <Star className={`w-8 h-8 ${s <= rating ? 'fill-current' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Meeting Context */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" /> Buluşma Tarihi
                        </label>
                        <Input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" /> Süre
                        </label>
                        <Input placeholder="Örn: 2 Saat" value={duration} onChange={(e) => setDuration(e.target.value)} className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" /> Şehir
                        </label>
                        <Input placeholder="Örn: İstanbul" value={city} onChange={(e) => setCity(e.target.value)} className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold" />
                    </div>
                </div>

                {/* 1-10 Ratings */}
                <div className="grid md:grid-cols-3 gap-6">
                    <RatingSlider label="GÖRÜNTÜSÜ" value={ratingAppearance} setter={setRatingAppearance} icon={Smile} />
                    <RatingSlider label="SERVİSLER" value={ratingService} setter={setRatingService} icon={Zap} />
                    <RatingSlider label="İLETİŞİM" value={ratingCommunication} setter={setRatingCommunication} icon={MessageCircle} />
                </div>

                {/* Service Details Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 bg-gray-50/30 p-10 rounded-[2.5rem] border border-gray-100">
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
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">DENEYİM NOTUNUZ</label>
                    <textarea
                        value={content} onChange={(e) => setContent(e.target.value)}
                        placeholder="Modelin servisi, tavrı ve genel deneyiminiz hakkında detaylı bilgi verin..."
                        className="w-full h-40 bg-gray-50/50 border border-gray-100 rounded-[2rem] p-8 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300"
                        required
                    />
                </div>

                <Button
                    onClick={handleSubmit} disabled={submitting}
                    className="w-full h-20 bg-primary text-white font-black uppercase tracking-[0.2em] text-lg rounded-[2rem] shadow-2xl shadow-primary/30 hover:translate-y-[-4px] active:scale-95 transition-all flex items-center justify-center gap-6"
                >
                    <Send className="w-6 h-6" /> {submitting ? 'GÖNDERİLİYOR...' : 'DEĞERLENDİRMEYİ YAYINLA'}
                </Button>
            </CardContent>
        </Card>
    );
}

