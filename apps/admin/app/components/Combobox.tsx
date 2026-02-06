'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface ComboboxProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    className?: string;
    disabled?: boolean;
}

export function Combobox({
    options,
    value,
    onChange,
    placeholder = 'Seçiniz...',
    searchPlaceholder = 'Ara...',
    emptyMessage = 'Sonuç bulunamadı.',
    className = '',
    disabled = false
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Selected label
    const selectedLabel = options.find((opt) => opt.value === value)?.label;

    // Filter options
    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    // Click outside to close
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => !disabled && setOpen(!open)}
                className={`flex h-11 w-full items-center justify-between rounded-lg border bg-black px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${open ? 'border-primary ring-2 ring-primary/10' : 'border-white/10 hover:border-white/20'
                    } ${disabled ? 'bg-white/5 opacity-50' : ''}`}
                disabled={disabled}
            >
                <span className={`block truncate ${!selectedLabel ? 'text-gray-400' : 'text-white font-black uppercase tracking-tight'}`}>
                    {selectedLabel || placeholder}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-80 text-primary" />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-white/10 bg-black/90 backdrop-blur-md shadow-2xl animate-in fade-in-0 zoom-in-95 duration-100 ring-1 ring-white/5">
                    <div className="flex items-center border-b border-white/10 px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-80 text-primary" />
                        <input
                            className="flex h-6 w-full rounded-md bg-transparent py-4 text-sm outline-none placeholder:text-gray-400 text-white font-medium"
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                        {filteredOptions.length === 0 ? (
                            <div className="py-6 text-center text-sm text-gray-400">
                                {emptyMessage}
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none transition-colors ${option.value === value
                                        ? 'bg-primary/20 text-primary font-bold'
                                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                        setSearch('');
                                    }}
                                >
                                    <Check
                                        className={`mr-2 h-4 w-4 ${option.value === value ? 'opacity-100 text-primary' : 'opacity-0'
                                            }`}
                                    />
                                    {option.label}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
