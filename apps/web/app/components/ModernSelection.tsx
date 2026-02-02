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

interface ModernSelectionProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
    className?: string;
}

export function ModernSelection({ options, value, onChange, label, className }: ModernSelectionProps) {
    return (
        <div className={cn("space-y-3", className)}>
            {label && <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.map((option) => {
                    const isActive = value === option.value;
                    return (
                        <div
                            key={option.value}
                            onClick={() => onChange(option.value)}
                            className={cn(
                                "relative flex items-center p-4 cursor-pointer rounded-2xl border-2 transition-all duration-200 group",
                                isActive
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-gray-100 bg-white hover:border-primary/30 hover:shadow-sm"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-colors",
                                isActive ? "bg-primary text-white" : "bg-gray-50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"
                            )}>
                                {option.icon || <Check className={cn("w-5 h-5", isActive ? "opacity-100" : "opacity-0")} />}
                            </div>
                            <div className="flex-1">
                                <p className={cn("font-bold text-sm", isActive ? "text-primary" : "text-gray-700")}>
                                    {option.label}
                                </p>
                                {option.description && (
                                    <p className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">
                                        {option.description}
                                    </p>
                                )}
                            </div>
                            {isActive && (
                                <div className="absolute top-2 right-2">
                                    <div className="bg-primary text-white rounded-full p-0.5">
                                        <Check className="w-3 h-3" />
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
