'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input } from '@repo/ui';
import { MessageCircle, Send, X, User, Clock, Loader2, LogIn, Image as ImageIcon, Mic, Video, Paperclip } from 'lucide-react';
import { cn } from '@repo/ui/src/lib/utils';
import Link from 'next/link';

interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    message: string;
    type: 'text' | 'image' | 'audio' | 'video' | 'file';
    file_url?: string;
    created_at: string;
    is_read: boolean;
}

interface ChatDrawerProps {
    receiverId: string;
    receiverName: string;
    isOpen: boolean;
    onClose: () => void;
}

export function ChatDrawer({ receiverId, receiverName, isOpen, onClose }: ChatDrawerProps) {
    const supabase = createClient();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);
            if (user && isOpen) {
                loadMessages(user.id);
                subscribeToMessages(user.id);
            }
        };
        checkUser();
    }, [isOpen, receiverId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const loadMessages = async (userId: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .or(`and(sender_id.eq.${userId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId})`)
            .order('created_at', { ascending: true });

        if (data) setMessages(data);
        setLoading(false);
    };

    const subscribeToMessages = (userId: string) => {
        const channel = supabase
            .channel('chat_messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: `receiver_id=eq.${userId}`,
                },
                (payload) => {
                    const msg = payload.new as Message;
                    if (msg.sender_id === receiverId) {
                        setMessages((prev) => [...prev, msg]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio' | 'video') => {
        const file = e.target.files?.[0];
        if (!file || !currentUser || sending) return;

        setSending(true);
        try {
            const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('chat-attachments')
                .upload(`${currentUser.id}/${fileName}`, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('chat-attachments')
                .getPublicUrl(`${currentUser.id}/${fileName}`);

            const msg = {
                sender_id: currentUser.id,
                receiver_id: receiverId,
                message: '',
                type: type,
                file_url: publicUrl,
            };

            const { data, error } = await supabase
                .from('chat_messages')
                .insert(msg)
                .select()
                .single();

            if (data) {
                setMessages((prev) => [...prev, data]);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Dosya yüklenirken bir hata oluştu.');
        } finally {
            setSending(false);
            e.target.value = '';
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser || sending) return;

        setSending(true);
        const msg = {
            sender_id: currentUser.id,
            receiver_id: receiverId,
            message: newMessage.trim(),
            type: 'text',
        };

        const { data, error } = await supabase
            .from('chat_messages')
            .insert(msg)
            .select()
            .single();

        if (data) {
            setMessages((prev) => [...prev, data]);
            setNewMessage('');
        }
        setSending(false);
    };

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[999999] flex justify-end transition-all duration-500 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white dark:bg-[#0A0A0A] h-full shadow-2xl flex flex-col border-l border-gray-100 dark:border-white/10">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50 dark:bg-black/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                            <User className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">{receiverName}</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">ÇEVRİMİÇİ</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors text-gray-400 dark:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Messages Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/30 dark:bg-transparent"
                >
                    {!currentUser ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 p-8">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
                                <LogIn className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Giriş Yapmalısınız</h4>
                                <p className="text-sm text-gray-500 font-medium">Sohbet başlatmak için lütfen üye girişi yapın.</p>
                            </div>
                            <Link href="/login" className="w-full">
                                <Button className="w-full h-14 bg-gold-gradient text-black font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20">
                                    Giriş Yap
                                </Button>
                            </Link>
                        </div>
                    ) : loading ? (
                        <div className="h-full flex items-center justify-center text-gray-400 font-black uppercase tracking-[0.2em] text-xs gap-3">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" /> Sohbet Yükleniyor...
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                            <MessageCircle className="w-16 h-16 text-primary" />
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Mesajlaşmaya başlayın...</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.sender_id === currentUser.id;
                            return (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex flex-col max-w-[85%]",
                                        isMe ? "ml-auto items-end" : "mr-auto items-start"
                                    )}
                                >
                                    <div className={cn(
                                        "p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-lg",
                                        isMe
                                            ? "bg-primary text-black rounded-tr-none shadow-primary/10"
                                            : "bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-white/5"
                                    )}>
                                        {msg.type === 'text' && msg.message}
                                        {msg.type === 'image' && msg.file_url && (
                                            <div className="space-y-2">
                                                <img src={msg.file_url} alt="Sent image" className="rounded-2xl max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(msg.file_url, '_blank')} />
                                                {msg.message && <p className="mt-2">{msg.message}</p>}
                                            </div>
                                        )}
                                        {msg.type === 'audio' && msg.file_url && (
                                            <div className="space-y-2 py-1">
                                                <audio controls className="h-8 max-w-[200px]">
                                                    <source src={msg.file_url} type="audio/mpeg" />
                                                </audio>
                                                {msg.message && <p className="mt-2">{msg.message}</p>}
                                            </div>
                                        )}
                                        {msg.type === 'video' && msg.file_url && (
                                            <div className="space-y-2">
                                                <video controls className="rounded-2xl max-w-full h-auto">
                                                    <source src={msg.file_url} type="video/mp4" />
                                                </video>
                                                {msg.message && <p className="mt-2">{msg.message}</p>}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest mt-2 px-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Input Area */}
                {currentUser && (
                    <div className="p-6 bg-white dark:bg-[#0A0A0A] border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                            <input
                                type="file"
                                id="image-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'image')}
                            />
                            <button
                                onClick={() => document.getElementById('image-upload')?.click()}
                                className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-primary transition-colors border border-gray-100 dark:border-white/5"
                                title="Fotoğraf Gönder"
                            >
                                <ImageIcon className="w-5 h-5" />
                            </button>

                            <input
                                type="file"
                                id="audio-upload"
                                className="hidden"
                                accept="audio/*"
                                onChange={(e) => handleFileUpload(e, 'audio')}
                            />
                            <button
                                onClick={() => document.getElementById('audio-upload')?.click()}
                                className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-primary transition-colors border border-gray-100 dark:border-white/5"
                                title="Ses Gönder"
                            >
                                <Mic className="w-5 h-5" />
                            </button>

                            <input
                                type="file"
                                id="video-upload"
                                className="hidden"
                                accept="video/*"
                                onChange={(e) => handleFileUpload(e, 'video')}
                            />
                            <button
                                onClick={() => document.getElementById('video-upload')?.click()}
                                className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-primary transition-colors border border-gray-100 dark:border-white/5"
                                title="Video Gönder"
                            >
                                <Video className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSendMessage} className="relative">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Mesajınızı yazın..."
                                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-white/10 rounded-[2rem] p-5 pr-16 text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-800 resize-none h-20"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim() || sending}
                                className="absolute right-3 bottom-3 w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                {sending ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : <Send className="w-5 h-5 text-black" />}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
