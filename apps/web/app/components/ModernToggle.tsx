'use client';

import React from 'react';
import { cn } from '@repo/ui/src/lib/utils';

interface ModernToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    icon?: React.ReactNode;
    className?: string;
}

export function ModernToggle({ label, checked, onChange, icon, className }: ModernToggleProps) {
    return (
        <div
            onClick={() => onChange(!checked)}
            className={cn(
                "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200",
                checked
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-gray-100 bg-white hover:border-gray-200",
                className
            )}
        >
            <div className="flex items-center gap-3">
                {icon && (
                    <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                        checked ? "bg-primary text-white" : "bg-gray-50 text-gray-400"
                    )}>
                        {icon}
                    </div>
                )}
                <span className={cn("text-xs font-bold", checked ? "text-primary" : "text-gray-600")}>
                    {label}
                </span>
            </div>

            <div className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                checked ? "bg-primary" : "bg-gray-200"
            )}>
                <span
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        checked ? "translate-x-4" : "translate-x-0"
                    )}
                />
            </div>
        </div>
    );
}
