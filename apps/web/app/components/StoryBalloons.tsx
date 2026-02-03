'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Sparkles, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@repo/ui/src/lib/utils';

export function StoryBalloons({ modelId }: { modelId?: string }) {
    const supabase = createClient();
    const [modelsWithStories, setModelsWithStories] = useState<any[]>([]);
    const [selectedModel, setSelectedModel] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStories = async () => {
            let query = supabase
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

            if (modelId) {
                query = query.eq('model_id', modelId);
            }

            const { data, error } = await query;

            if (data && data.length > 0) {
                // Group by model
                const grouped = data.reduce((acc: any, story: any) => {
                    const mId = story.model_id;
                    if (!acc[mId]) {
                        acc[mId] = {
                            model: story.independent_models,
                            stories: [],
                            photo: null
                        };
                    }
                    acc[mId].stories.push(story);
                    return acc;
                }, {});

                // Fetch listing photos (real profile photos)
                const modelIds = Object.keys(grouped);
                const { data: listings } = await supabase
                    .from('listings')
                    .select('user_id, cover_image, images')
                    .in('user_id', modelIds);

                if (listings) {
                    listings.forEach((l: any) => {
                        if (grouped[l.user_id]) {
                            // Use cover_image or first image
                            grouped[l.user_id].photo = l.cover_image || (l.images && l.images[0]) || null;
                        }
                    });
                }

                setModelsWithStories(Object.values(grouped));
            } else {
                setModelsWithStories([]);
            }
            setLoading(false);
        };
        loadStories();
    }, [modelId]);

    if (loading || modelsWithStories.length === 0) return null;

    return (
        <>
            <div className={cn("container mx-auto px-4 mt-4", modelId ? "px-0 mt-0" : "")}>
                <div className={cn("flex items-center overflow-x-auto pb-2 no-scrollbar", modelId ? "justify-start" : "gap-3")}>
                    {modelsWithStories.map((item: any) => (
                        <button
                            key={item.model.id}
                            onClick={() => setSelectedModel(item)}
                            className="flex flex-col items-center gap-1.5 shrink-0 group"
                        >
                            <div className={cn(
                                "rounded-full p-[2px] bg-gradient-to-tr from-primary via-primary/50 to-pink-500 animate-gradient-xy group-hover:scale-105 transition-transform",
                                modelId ? "w-20 h-20" : "w-16 h-16" // Larger on profile page, smaller on homepage
                            )}>
                                <div className="w-full h-full rounded-full border-[2px] border-white overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {item.photo ? (
                                        <img
                                            src={item.photo}
                                            alt={item.model.full_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xs font-bold text-gray-400">FPS</span>
                                    )}
                                </div>
                            </div>
                            {!modelId && (
                                <span className="text-[9px] font-black text-gray-700 uppercase tracking-tighter truncate w-16 text-center">
                                    {item.model.full_name || item.model.username}
                                </span>
                            )}
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
                        <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-800">
                            {item.photo ? (
                                <img src={item.photo} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.model.username}`} alt="" />
                            )}
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
