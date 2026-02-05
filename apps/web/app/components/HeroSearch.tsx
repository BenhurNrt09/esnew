'use client';

import { useRouter } from 'next/navigation';
import { MapPin, Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function HeroSearch({ cities }: { cities: { id: string; name: string; slug: string }[] }) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filteredCities = cities.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (slug: string) => {
        router.push(`/sehir/${slug}`);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div className="w-full max-w-[280px] sm:max-w-xs mx-auto relative group" ref={wrapperRef}>
            <div className={`
                flex items-center bg-white rounded-full transition-all duration-300 border-2
                ${isOpen ? 'border-primary shadow-2xl ring-4 ring-primary/10' : 'border-primary/10 shadow-xl shadow-primary/10 hover:border-primary/30'}
                p-1 overflow-hidden
            `}>
                <div className="pl-2.5 pr-1 text-primary">
                    <MapPin className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? 'scale-110' : ''}`} />
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Şehir ara (İstanbul, İzmir...)"
                    className="flex-1 h-7 sm:h-8 bg-transparent border-none outline-none text-gray-800 font-bold text-[10px] sm:text-xs placeholder:text-gray-400 placeholder:font-medium"
                />

                {query && (
                    <button
                        onClick={() => setQuery('')}
                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}

                <button
                    className="bg-gold-gradient hover:opacity-90 text-black rounded-full px-2.5 sm:px-4 h-7 sm:h-8 flex items-center gap-1 transition-all font-black text-[9px] uppercase tracking-wider shadow-lg shadow-primary/30 active:scale-95 border-none"
                >
                    <Search className="h-3 w-3" />
                    <span className="hidden sm:inline">BUL</span>
                </button>
            </div>

            {/* Dropdown Results */}
            {isOpen && (filteredCities.length > 0 || query) && (
                <div className="absolute top-full left-0 right-0 mt-2 sm:mt-3 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    {filteredCities.length > 0 ? (
                        <div className="p-2 sm:p-3">
                            <p className="px-3 py-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">Eşleşen Şehirler</p>
                            {filteredCities.map((city) => (
                                <button
                                    key={city.id}
                                    onClick={() => handleSelect(city.slug)}
                                    className="w-full text-left px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-primary/5 flex items-center justify-between group transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-primary transition-colors">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <span className="font-bold text-gray-700 group-hover:text-primary transition-colors">{city.name}</span>
                                    </div>
                                    <Search className="h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 sm:p-8 text-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Search className="h-6 w-6 text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium">"{query}" ile ilgili sonuç bulunamadı.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
