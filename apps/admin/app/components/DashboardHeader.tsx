'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@repo/lib/i18n';
import { createClient } from '@repo/lib/supabase/client';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

// Capitalize first letter of each word
function capitalizeUsername(name: string): string {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export function DashboardHeader() {
    const { t } = useLanguage();
    const router = useRouter();
    const [userName, setUserName] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                
                if (user) {
                    let displayName = '';

                    // Try original username from metadata first (preserves case)
                    if (user.user_metadata?.original_username) {
                        displayName = user.user_metadata.original_username;
                    } else if (user.user_metadata?.display_name) {
                        displayName = user.user_metadata.display_name;
                    } else if (user.user_metadata?.username) {
                        displayName = user.user_metadata.username;
                    } else {
                        // Try to fetch from members table
                        const { data: memberData } = await supabase
                            .from('members')
                            .select('username, first_name, last_name')
                            .eq('id', user.id)
                            .single();
                        
                        if (memberData) {
                            displayName = memberData.first_name && memberData.last_name 
                                ? `${memberData.first_name} ${memberData.last_name}`
                                : memberData.username;
                        } else {
                            // Try independent_models
                            const { data: modelData } = await supabase
                                .from('independent_models')
                                .select('username, display_name')
                                .eq('id', user.id)
                                .single();
                            
                            if (modelData) {
                                displayName = modelData.display_name || modelData.username;
                            } else {
                                // Try agencies
                                const { data: agencyData } = await supabase
                                    .from('agencies')
                                    .select('company_name, username')
                                    .eq('id', user.id)
                                    .single();
                                
                                if (agencyData) {
                                    displayName = agencyData.company_name || agencyData.username;
                                }
                            }
                        }
                    }

                    // Fallback to email if nothing found
                    if (!displayName) {
                        displayName = user.email?.split('@')[0] || 'Kullanıcı';
                    }

                    // Capitalize display name
                    displayName = capitalizeUsername(displayName);
                    setUserName(displayName);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    {/* Mobile logo */}
                </div>
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <div className="flex items-center gap-2 text-sm text-gray-700 font-medium capitalize">
                        {!loading && <span>{userName}</span>}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <LogOut className="h-4 w-4" />
                        {t.nav.logout}
                    </Button>
                </div>
            </div>
        </header>
    );
}
