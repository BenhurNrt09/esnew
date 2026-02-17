'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Card, CardContent, Button } from '@repo/ui';
import { MessageSquare, User, Clock, Loader2, ChevronRight } from 'lucide-react';
import { ChatDrawer } from '../../components/ChatDrawer';
import { cn } from '@repo/ui/src/lib/utils';

interface Conversation {
    participant_id: string;
    participant_name: string;
    last_message: string;
    last_message_at: string;
    unread_count: number;
}

export default function MessagesPage() {
    const supabase = createClient();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState<{ id: string; name: string } | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);
            if (user) {
                loadConversations(user.id);
            }
        };
        init();
    }, []);

    const loadConversations = async (userId: string) => {
        setLoading(true);
        try {
            // Fetch all messages where user is sender or receiver
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
                .order('created_at', { ascending: false });

            if (data) {
                // Group by participant
                const grouped = data.reduce((acc: any, msg: any) => {
                    const participantId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
                    if (!acc[participantId]) {
                        acc[participantId] = {
                            participant_id: participantId,
                            participant_name: 'Yükleniyor...', // We'll need to fetch metabolic/profile data or use ID
                            last_message: msg.message,
                            last_message_at: msg.created_at,
                            unread_count: !msg.is_read && msg.receiver_id === userId ? 1 : 0
                        };
                    } else if (!msg.is_read && msg.receiver_id === userId) {
                        acc[participantId].unread_count++;
                    }
                    return acc;
                }, {});

                const conversationList = Object.values(grouped) as Conversation[];
                setConversations(conversationList);

                // Fetch participant names (Optional: Improve this by joining or batch fetching)
                conversationList.forEach(async (conv) => {
                    const { data: userData } = await supabase
                        .from('members')
                        .select('full_name')
                        .eq('user_id', conv.participant_id)
                        .single();

                    if (userData?.full_name) {
                        setConversations(prev => prev.map(c =>
                            c.participant_id === conv.participant_id
                                ? { ...c, participant_name: userData.full_name }
                                : c
                        ));
                    } else {
                        // Try independent_models
                        const { data: modelData } = await supabase
                            .from('listings')
                            .select('title')
                            .eq('user_id', conv.participant_id)
                            .limit(1)
                            .single();

                        setConversations(prev => prev.map(c =>
                            c.participant_id === conv.participant_id
                                ? { ...c, participant_name: modelData?.title || 'Kullanıcı' }
                                : c
                        ));
                    }
                });
            }
        } catch (err) {
            console.error('Error loading conversations:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center text-gray-400 font-black uppercase tracking-widest text-xs gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" /> Mesajlar Yükleniyor...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Mesajlar</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Gelen mesajları görüntüleyin ve yanıtlayın.</p>
            </div>

            <Card className="shadow-2xl shadow-gray-200/50 dark:shadow-none border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden bg-white dark:bg-[#0a0a0a]">
                <CardContent className="p-0">
                    <div className="divide-y divide-gray-50 dark:divide-white/5">
                        {conversations.map((conv) => (
                            <div
                                key={conv.participant_id}
                                onClick={() => setSelectedChat({ id: conv.participant_id, name: conv.participant_name })}
                                className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <User className="w-6 h-6 text-gray-400" />
                                        </div>
                                        {conv.unread_count > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-black text-[10px] font-black rounded-lg flex items-center justify-center border-2 border-white dark:border-black">
                                                {conv.unread_count}
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter text-sm group-hover:text-primary transition-colors">
                                            {conv.participant_name}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate max-w-[200px] md:max-w-md">
                                            {conv.last_message}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" /> {new Date(conv.last_message_at).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                            </div>
                        ))}

                        {conversations.length === 0 && (
                            <div className="py-20 text-center text-gray-400 font-bold">
                                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>Henüz mesajınız bulunmuyor.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {selectedChat && (
                <ChatDrawer
                    receiverId={selectedChat.id}
                    receiverName={selectedChat.name}
                    isOpen={!!selectedChat}
                    onClose={() => setSelectedChat(null)}
                />
            )}
        </div>
    );
}
