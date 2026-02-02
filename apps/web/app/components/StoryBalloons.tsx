'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Sparkles, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@repo/ui/src/lib/utils';

export function StoryBalloons() {
    const supabase = createClient();
    const [modelsWithStories, setModelsWithStories] = useState<any[]>([]);
    const [selectedModel, setSelectedModel] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStories = async () => {
            const { data, error } = await supabase
                .from('stories')
                .select(`
                    id,
                    media_url,
                    media_type,
                    model_id,
                    expires_at,
                    independent_models (
                        id,
                        username,
                        full_name,
                        gender
                    )
                `)
                .eq('is_active', true)
                .gt('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false });

            if (data) {
                // Group by model
                const grouped = data.reduce((acc: any, story: any) => {
                    const modelId = story.model_id;
                    if (!acc[modelId]) {
                        acc[modelId] = {
                            model: story.independent_models,
                            stories: []
                        };
                    }
                    acc[modelId].stories.push(story);
                    return acc;
                }, {});

                setModelsWithStories(Object.values(grouped));
            }
            setLoading(false);
        };
        loadStories();
    }, []);

    if (loading || modelsWithStories.length === 0) return null;

    return (
        <>
            <div className="container mx-auto px-4 mt-8">
                <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {modelsWithStories.map((item: any) => (
                        <button
                            key={item.model.id}
                            onClick={() => setSelectedModel(item)}
                            className="flex flex-col items-center gap-2 shrink-0 group"
                        >
                            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-primary via-primary/50 to-pink-500 animate-gradient-xy group-hover:scale-110 transition-transform">
                                <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-gray-100">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.model.username}`}
                                        alt={item.model.full_name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter truncate w-20 text-center">
                                {item.model.full_name || item.model.username}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Story Viewer Modal */}
            {selectedModel && (
                <StoryViewer
                    item={selectedModel}
                    onClose={() => setSelectedModel(null)}
                />
            )}
        </>
    );
}

function StoryViewer({ item, onClose }: { item: any, onClose: () => void }) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const story = item.stories[currentIdx];

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentIdx < item.stories.length - 1) {
                setCurrentIdx(currentIdx + 1);
            } else {
                onClose();
            }
        }, 5000); // 5 sec per story
        return () => clearTimeout(timer);
    }, [currentIdx, item.stories.length, onClose]);

    return (
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-[9/16] bg-gray-900 overflow-hidden md:rounded-3xl shadow-2xl">
                {/* Progress Bars */}
                <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
                    {item.stories.map((_: any, i: number) => (
                        <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full bg-white transition-all duration-5000 linear",
                                    i < currentIdx ? "w-full" : i === currentIdx ? "animate-story-progress" : "w-0"
                                )}
                            />
                        </div>
                    ))}
                </div>

                {/* Header */}
                <div className="absolute top-8 left-4 right-4 z-10 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.model.username}`} alt="" />
                        </div>
                        <span className="font-black uppercase tracking-tighter text-sm">{item.model.full_name}</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Media */}
                {story.media_type === 'video' ? (
                    <video
                        src={story.media_url}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img src={story.media_url} className="w-full h-full object-cover" alt="" />
                )}

                {/* Controls */}
                <button
                    onClick={() => currentIdx > 0 && setCurrentIdx(currentIdx - 1)}
                    className="absolute left-0 top-0 bottom-0 w-1/4 z-20"
                />
                <button
                    onClick={() => currentIdx < item.stories.length - 1 ? setCurrentIdx(currentIdx + 1) : onClose()}
                    className="absolute right-0 top-0 bottom-0 w-1/4 z-20"
                />
            </div>
        </div>
    );
}
