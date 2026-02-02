'use client';

import React from 'react';
import { cn } from '@repo/ui/src/lib/utils';
import { User, Ruler, Weight as WeightIcon, Scissors, Circle, Calendar } from 'lucide-react';

interface FilterOption {
    label: string;
    value: string;
    icon?: React.ReactNode;
}

interface FilterGroupProps {
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    icon: React.ReactNode;
}

function FilterGroup({ label, options, value, onChange, icon }: FilterGroupProps) {
    return (
        <div className="flex flex-col gap-2 min-w-[110px] sm:min-w-[140px]">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                {icon} {label}
            </label>
            <div className="flex p-1 bg-gray-100 rounded-xl gap-1">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            "flex-1 px-3 py-2 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap",
                            value === opt.value
                                ? "bg-white text-primary shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export function HorizontalFilterBar({ filters, setFilters }: { filters: any, setFilters: any }) {
    const raceOptions = [
        { label: 'Hepsi', value: 'all' },
        { label: 'Türk', value: 'turk' },
        { label: 'Rus', value: 'rus' },
        { label: 'Lat', value: 'latin' },
    ];

    const ageOptions = [
        { label: 'Hepsi', value: 'all' },
        { label: '18-25', value: '18-25' },
        { label: '25-35', value: '25-35' },
        { label: '35+', value: '35-plus' },
    ];

    const breastOptions = [
        { label: 'Hepsi', value: 'all' },
        { label: 'A/B', value: 'small' },
        { label: 'C/D', value: 'medium' },
        { label: 'DD+', value: 'large' },
    ];

    const hairOptions = [
        { label: 'Hepsi', value: 'all' },
        { label: 'Sar', value: 'sari' },
        { label: 'Esmer', value: 'esmer' },
        { label: 'Kum', value: 'kumral' },
    ];

    const weightOptions = [
        { label: 'Hepsi', value: 'all' },
        { label: '45-55', value: '45-55' },
        { label: '55-65', value: '55-65' },
        { label: '65+', value: '65-plus' },
    ];

    const heightOptions = [
        { label: 'Hepsi', value: 'all' },
        { label: '160-', value: 'short' },
        { label: '160-175', value: 'medium' },
        { label: '175+', value: 'tall' },
    ];

    return (
        <div className="w-full bg-white border-y border-gray-100 shadow-sm sticky top-16 z-40 overflow-x-auto no-scrollbar">
            <div className="container mx-auto px-4 py-4 flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6">
                <FilterGroup
                    label="IRK"
                    icon={<User className="w-3 h-3" />}
                    options={raceOptions}
                    value={filters.race}
                    onChange={(v) => setFilters({ ...filters, race: v })}
                />
                <FilterGroup
                    label="YAŞ"
                    icon={<Calendar className="w-3 h-3" />}
                    options={ageOptions}
                    value={filters.age}
                    onChange={(v) => setFilters({ ...filters, age: v })}
                />
                <FilterGroup
                    label="BOY"
                    icon={<Ruler className="w-3 h-3" />}
                    options={heightOptions}
                    value={filters.height}
                    onChange={(v) => setFilters({ ...filters, height: v })}
                />
                <FilterGroup
                    label="KİLO"
                    icon={<WeightIcon className="w-3 h-3" />}
                    options={weightOptions}
                    value={filters.weight}
                    onChange={(v) => setFilters({ ...filters, weight: v })}
                />
                <FilterGroup
                    label="SAÇ"
                    icon={<Scissors className="w-3 h-3" />}
                    options={hairOptions}
                    value={filters.hair}
                    onChange={(v) => setFilters({ ...filters, hair: v })}
                />
                <FilterGroup
                    label="MEME"
                    icon={<Circle className="w-3 h-3" />}
                    options={breastOptions}
                    value={filters.breast}
                    onChange={(v) => setFilters({ ...filters, breast: v })}
                />
            </div>
        </div>
    );
}
