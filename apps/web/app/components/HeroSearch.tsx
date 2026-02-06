'use client';

import { useRouter } from 'next/navigation';
import { MapPin, Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function HeroSearch({ cities }: { cities: { id: string; name: string; slug: string }[] }) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const handleSearch = () => {
        if (!query.trim()) return;
        // Search by city name via query param 'sehir' or just general search?
        // User said "remove matching cities, write directly and search".
        // Usually listing page filters by `sehir` query param if looking for city.
        // But if text is generic, maybe 'q'? 
        // Existing app uses `sehir` slug mostly. 
        // Let's assume generic search -> /ilanlar?q=... OR if it looks like a city, /ilanlar?sehir=...
        // Safest is to just send as 'q' or 'search' to ilanlar page and let it handle.
        // Or send as 'sehir' if that's the main intent. The placeholder says "Şehir ara".
        // So I will send it as 'sehir' param but as text, not slug. 
        // The filter component needs to handle text matching if possible, or I redirect to /ilanlar?search=...
        router.push(`/ilanlar?search=${encodeURIComponent(query.trim())}`);
    };

    return (
        <div className="w-full max-w-[280px] sm:max-w-xs mx-auto relative group">
            <div className={`
                flex items-center bg-white dark:bg-gray-800/80 backdrop-blur-xl rounded-full transition-all duration-300 border-2
                border-gray-100 dark:border-white/20 shadow-xl hover:border-primary/30
                p-1 overflow-hidden
            `}>
                <div className="pl-2.5 pr-1 text-primary">
                    <MapPin className="h-3.5 w-3.5" />
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Şehir ara (İstanbul, İzmir...)"
                    className="flex-1 h-7 sm:h-8 bg-transparent border-none outline-none text-black dark:text-white font-bold text-[10px] sm:text-xs placeholder:text-gray-400 placeholder:font-medium"
                />

                {query && (
                    <button
                        onClick={() => setQuery('')}
                        className="p-2 text-gray-500 hover:text-primary transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}

                <button
                    onClick={handleSearch}
                    className="bg-gold-gradient hover:opacity-90 text-black rounded-full px-2.5 sm:px-4 h-7 sm:h-8 flex items-center gap-1 transition-all font-black text-[9px] uppercase tracking-wider shadow-lg shadow-primary/30 active:scale-95 border-none"
                >
                    <Search className="h-3 w-3" />
                    <span className="hidden sm:inline">BUL</span>
                </button>
            </div>
        </div>
    );
}
