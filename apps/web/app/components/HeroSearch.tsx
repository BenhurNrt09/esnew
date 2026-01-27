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
        <div className="w-full max-w-xl mx-auto relative group" ref={wrapperRef}>
            <div className={`
                flex items-center bg-white rounded-full transition-all duration-300 border-2
                ${isOpen ? 'border-red-500 shadow-2xl ring-4 ring-red-500/10' : 'border-red-100 shadow-xl shadow-red-950/10 hover:border-red-300'}
                p-1.5 overflow-hidden
            `}>
                <div className="pl-5 pr-3 text-red-500">
                    <MapPin className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'scale-110' : ''}`} />
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Şehir ara (Örn: İstanbul, İzmir...)"
                    className="flex-1 h-12 bg-transparent border-none outline-none text-gray-800 font-bold text-lg placeholder:text-gray-400 placeholder:font-medium"
                />

                {query && (
                    <button
                        onClick={() => setQuery('')}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}

                <button
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 h-12 flex items-center gap-2 transition-all font-black text-sm uppercase tracking-wider shadow-lg shadow-red-600/30 active:scale-95"
                >
                    <Search className="h-5 w-5" />
                    <span className="hidden sm:inline">BUL</span>
                </button>
            </div>

            {/* Dropdown Results */}
            {isOpen && (filteredCities.length > 0 || query) && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    {filteredCities.length > 0 ? (
                        <div className="p-3">
                            <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Eşleşen Şehirler</p>
                            {filteredCities.map((city) => (
                                <button
                                    key={city.id}
                                    onClick={() => handleSelect(city.slug)}
                                    className="w-full text-left px-4 py-3 rounded-2xl hover:bg-red-50 flex items-center justify-between group transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-red-500 transition-colors">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <span className="font-bold text-gray-700 group-hover:text-red-600 transition-colors">{city.name}</span>
                                    </div>
                                    <Search className="h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
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
