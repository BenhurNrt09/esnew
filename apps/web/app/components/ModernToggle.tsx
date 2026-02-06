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
                "flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all duration-200",
                checked
                    ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm"
                    : "border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-gray-200 dark:hover:border-primary/20",
                className
            )}
        >
            <div className="flex items-center gap-2">
                {icon && (
                    <div className={cn(
                        "w-6 h-6 rounded-lg flex items-center justify-center transition-colors",
                        checked ? "bg-primary text-white" : "bg-gray-50 dark:bg-white/10 text-gray-400 dark:text-gray-500"
                    )}>
                        {React.cloneElement(icon as React.ReactElement, { className: 'w-3.5 h-3.5' })}
                    </div>
                )}
                <span className={cn("text-[10px] font-bold uppercase tracking-tight", checked ? "text-primary" : "text-gray-600 dark:text-gray-400")}>
                    {label}
                </span>
            </div>

            <div className={cn(
                "relative inline-flex h-4 w-7.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                checked ? "bg-primary" : "bg-gray-200 dark:bg-white/10"
            )}>
                <span
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        checked ? "translate-x-3.5" : "translate-x-0"
                    )}
                />
            </div>
        </div>
    );
}
