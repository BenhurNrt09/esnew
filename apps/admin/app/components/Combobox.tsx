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
                className={`flex h-11 w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${open ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-gray-200 hover:border-gray-300'
                    } ${disabled ? 'bg-gray-100' : ''}`}
                disabled={disabled}
            >
                <span className={`block truncate ${!selectedLabel ? 'text-muted-foreground' : 'text-gray-900 font-medium'}`}>
                    {selectedLabel || placeholder}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-100 bg-white shadow-lg animate-in fade-in-0 zoom-in-95 duration-100">
                    <div className="flex items-center border-b border-gray-100 px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-gray-400" />
                        <input
                            className="flex h-6 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400"
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
                                            ? 'bg-amber-50 text-amber-900 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                        setSearch('');
                                    }}
                                >
                                    <Check
                                        className={`mr-2 h-4 w-4 ${option.value === value ? 'opacity-100 text-amber-600' : 'opacity-0'
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
