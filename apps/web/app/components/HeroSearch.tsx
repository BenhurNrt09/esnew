'use client';

import { useRouter } from 'next/navigation';
import { MapPin, Search } from 'lucide-react';

export function HeroSearch({ cities }: { cities: { id: string; name: string; slug: string }[] }) {
    const router = useRouter();

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const slug = e.target.value;
        if (slug) {
            router.push(`/sehir/${slug}`);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-white p-2 rounded-full shadow-2xl shadow-red-900/20 transform transition-transform hover:scale-105 duration-300 flex items-center border border-red-100">
            <div className="pl-4 pr-3 text-red-500">
                <MapPin className="h-5 w-5" />
            </div>
            <div className="flex-1 relative">
                <select
                    onChange={handleCityChange}
                    className="w-full h-12 bg-transparent border-none outline-none text-gray-700 font-medium appearance-none cursor-pointer pr-8"
                    defaultValue=""
                >
                    <option value="" disabled>Hangi şehirde arıyorsunuz?</option>
                    {cities.map(c => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                </select>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors shadow-lg shadow-red-600/30">
                <Search className="h-5 w-5" />
            </button>
        </div>
    );
}
