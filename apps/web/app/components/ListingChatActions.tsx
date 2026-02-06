'use client';

import { useState } from 'react';
import { Button } from '@repo/ui';
import { MessageCircle } from 'lucide-react';
import { ChatDrawer } from './ChatDrawer';

interface ListingChatActionsProps {
    receiverId: string;
    receiverName: string;
}

export function ListingChatActions({ receiverId, receiverName }: ListingChatActionsProps) {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <>
            <Button
                size="sm"
                variant="outline"
                className="bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-white/10 text-black dark:text-white hover:text-primary dark:hover:text-primary gap-2 rounded-full h-10 sm:h-11 px-4 sm:px-6 border border-gray-200 dark:border-white/20 shadow-xl text-xs sm:text-sm font-black uppercase tracking-wide transition-all hover:scale-105 active:scale-95 group"
                onClick={() => setIsChatOpen(true)}
            >
                <MessageCircle className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform" /> CANLI SOHBET
            </Button>

            <ChatDrawer
                receiverId={receiverId}
                receiverName={receiverName}
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
            />
        </>
    );
}
