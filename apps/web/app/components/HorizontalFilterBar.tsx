'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@repo/ui/src/lib/utils';
import { User, Ruler, Weight as WeightIcon, Scissors, Circle, Calendar, ChevronDown } from 'lucide-react';
import { useLanguage } from '@repo/lib/i18n';

interface FilterOption {
    label: string;
    value: string;
}

interface FilterDropdownProps {
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    icon: React.ReactNode;
}

function FilterDropdown({ label, options, value, onChange, icon }: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all min-w-[120px] justify-between",
                    value !== 'all'
                        ? "bg-primary text-black border-primary shadow-sm"
                        : "bg-white/5 text-gray-400 border-white/10 hover:border-primary/50"
                )}
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-bold text-xs uppercase tracking-wider">{label}</span>
                </div>
                <div className="flex items-center gap-1">
                    {value !== 'all' && (
                        <span className="text-[10px] font-bold bg-black/20 px-2 py-0.5 rounded">
                            {selectedOption?.label}
                        </span>
                    )}
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full min-w-[160px] bg-[#0a0a0a] rounded-lg shadow-2xl border border-white/10 py-1 z-50">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "w-full text-left px-4 py-2 text-sm font-medium transition-colors",
                                value === opt.value
                                    ? "bg-primary text-black"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export function HorizontalFilterBar({ filters, setFilters }: { filters: any, setFilters: any }) {
    const { t } = useLanguage();
    const f = t.filters;

    const raceOptions = [
        { label: f.all, value: 'all' },
        { label: f.turkish, value: 'turk' },
        { label: f.russian, value: 'rus' },
        { label: f.latin, value: 'latin' },
    ];

    const ageOptions = [
        { label: f.all, value: 'all' },
        { label: '18-25', value: '18-25' },
        { label: '25-35', value: '25-35' },
        { label: '35+', value: '35-plus' },
    ];

    const breastOptions = [
        { label: f.all, value: 'all' },
        { label: 'A/B', value: 'small' },
        { label: 'C/D', value: 'medium' },
        { label: 'DD+', value: 'large' },
    ];

    const hairOptions = [
        { label: f.all, value: 'all' },
        { label: f.blonde, value: 'sari' },
        { label: f.brunette, value: 'esmer' },
        { label: f.brown, value: 'kumral' },
    ];

    const weightOptions = [
        { label: f.all, value: 'all' },
        { label: '45-55', value: '45-55' },
        { label: '55-65', value: '55-65' },
        { label: '65+', value: '65-plus' },
    ];

    const heightOptions = [
        { label: f.all, value: 'all' },
        { label: '160-', value: 'short' },
        { label: '160-175', value: 'medium' },
        { label: '175+', value: 'tall' },
    ];

    return (
        <div className="w-full bg-black border-y border-white/5 shadow-2xl shadow-black">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <FilterDropdown
                        label={f.race}
                        icon={<User className="w-3.5 h-3.5" />}
                        options={raceOptions}
                        value={filters.race}
                        onChange={(v) => setFilters({ ...filters, race: v })}
                    />
                    <FilterDropdown
                        label={f.age}
                        icon={<Calendar className="w-3.5 h-3.5" />}
                        options={ageOptions}
                        value={filters.age}
                        onChange={(v) => setFilters({ ...filters, age: v })}
                    />
                    <FilterDropdown
                        label={f.height}
                        icon={<Ruler className="w-3.5 h-3.5" />}
                        options={heightOptions}
                        value={filters.height}
                        onChange={(v) => setFilters({ ...filters, height: v })}
                    />
                    <FilterDropdown
                        label={f.weight}
                        icon={<WeightIcon className="w-3.5 h-3.5" />}
                        options={weightOptions}
                        value={filters.weight}
                        onChange={(v) => setFilters({ ...filters, weight: v })}
                    />
                    <FilterDropdown
                        label={f.hair}
                        icon={<Scissors className="w-3.5 h-3.5" />}
                        options={hairOptions}
                        value={filters.hair}
                        onChange={(v) => setFilters({ ...filters, hair: v })}
                    />
                    {/* <FilterDropdown
                        label={f.breast}
                        icon={<Circle className="w-3.5 h-3.5" />}
                        options={breastOptions}
                        value={filters.breast}
                        onChange={(v) => setFilters({ ...filters, breast: v })}
                    /> */}
                </div>
            </div>
        </div>
    );
}
