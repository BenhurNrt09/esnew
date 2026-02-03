'use client';

import React from 'react';
import { cn } from '@repo/ui/src/lib/utils';
import { Check } from 'lucide-react';

interface Option {
    value: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
}

interface ModernMultiSelectionProps {
    options: Option[];
    values: string[];
    onChange: (values: string[]) => void;
    label?: string;
    className?: string;
}

export function ModernMultiSelection({ options, values = [], onChange, label, className }: ModernMultiSelectionProps) {
    const toggleOption = (val: string) => {
        if (values.includes(val)) {
            onChange(values.filter(v => v !== val));
        } else {
            onChange([...values, val]);
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            {label && <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{label}</label>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.map((option) => {
                    const isActive = values.includes(option.value);
                    return (
                        <div
                            key={option.value}
                            onClick={() => toggleOption(option.value)}
                            className={cn(
                                "relative flex items-center p-2.5 cursor-pointer rounded-xl border-2 transition-all duration-200 group",
                                isActive
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-gray-100 bg-white hover:border-primary/20 hover:shadow-xs"
                            )}
                        >
                            <div className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center mr-3 transition-colors",
                                isActive ? "bg-primary text-white" : "bg-gray-50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"
                            )}>
                                {option.icon ? (
                                    React.cloneElement(option.icon as React.ReactElement, { className: 'w-3.5 h-3.5' })
                                ) : (
                                    <Check className={cn("w-3.5 h-3.5", isActive ? "opacity-100" : "opacity-0")} />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className={cn("font-bold text-[11px] leading-tight", isActive ? "text-primary" : "text-gray-700")}>
                                    {option.label}
                                </p>
                                {option.description && (
                                    <p className="text-[9px] text-gray-400 font-medium leading-tight mt-0.5">
                                        {option.description}
                                    </p>
                                )}
                            </div>
                            {isActive && (
                                <div className="absolute top-1 right-1">
                                    <div className="bg-primary text-white rounded-full p-0.5">
                                        <Check className="w-2.5 h-2.5" />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
