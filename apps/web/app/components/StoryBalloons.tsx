'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Sparkles, ChevronLeft, ChevronRight, X, User } from 'lucide-react';
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
                    // Filter out stories where the model relation is missing (deleted user)
                    if (!story.independent_models) return acc;

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
                                "rounded-full p-[2px] bg-gradient-to-tr from-primary via-primary/50 to-primary/80 animate-gradient-xy group-hover:scale-105 transition-transform",
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
                                        <User className="w-1/2 h-1/2 text-gray-400" />
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
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="relative w-full max-w-sm sm:max-w-md max-h-[85vh] aspect-[9/16] bg-gray-900 overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl flex flex-col border border-white/10"
                onClick={e => e.stopPropagation()}
            >
                {/* Progress Bars */}
                <div className="absolute top-3 left-3 right-3 z-30 flex gap-1">
                    {item.stories.map((_: any, i: number) => (
                        <div key={i} className="flex-1 h-0.5 sm:h-1 bg-white/20 rounded-full overflow-hidden">
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
                <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2.5 bg-black/20 backdrop-blur-sm p-1.5 pr-4 rounded-full border border-white/5">
                        <div className="w-8 h-8 rounded-full border border-white/50 overflow-hidden bg-gray-800">
                            {item.photo ? (
                                <img src={item.photo} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.model.username}`} alt="" />
                            )}
                        </div>
                        <span className="font-bold text-shadow uppercase tracking-tight text-xs shadow-black truncate max-w-[120px]">{item.model.full_name}</span>
                    </div>
                </div>

                {/* External Close Button (PC) */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-3 z-40 p-2 bg-black/40 hover:bg-primary/80 rounded-full transition-all backdrop-blur-md border border-white/10 group"
                >
                    <X className="w-5 h-5 text-white drop-shadow-md group-hover:rotate-90 transition-transform" />
                </button>

                {/* Media Container */}
                <div className="flex-1 relative flex items-center justify-center bg-black w-full h-full">
                    {/* Blurred Background Layer */}
                    {story.media_type !== 'video' && (
                        <div className="absolute inset-0 opacity-40 blur-3xl scale-125">
                            <img src={story.media_url} className="w-full h-full object-cover" alt="" />
                        </div>
                    )}

                    {/* Main Content */}
                    {story.media_type === 'video' ? (
                        <video
                            src={story.media_url}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full max-h-full object-contain relative z-20"
                        />
                    ) : (
                        <img src={story.media_url} className="w-full h-full max-h-full object-contain relative z-20" alt="" />
                    )}
                </div>

                {/* Touch/Click Controls */}
                <button
                    onClick={() => currentIdx > 0 && setCurrentIdx(currentIdx - 1)}
                    className="absolute left-0 top-0 bottom-0 w-1/3 z-20 outline-none focus:outline-none cursor-pointer"
                    aria-label="Previous story"
                />
                <button
                    onClick={() => currentIdx < item.stories.length - 1 ? setCurrentIdx(currentIdx + 1) : onClose()}
                    className="absolute right-0 top-0 bottom-0 w-1/3 z-20 outline-none focus:outline-none cursor-pointer"
                    aria-label="Next story"
                />
            </div>

            {/* Desktop Hint - Outside Modal */}
            <div className="absolute top-6 right-6 hidden md:flex items-center gap-2 text-white/50 text-xs font-bold pointer-events-none select-none">
                <span className="bg-white/10 px-2 py-1 rounded border border-white/5">ESC</span> veya boşluğa tıkla
            </div>
        </div>
    );
}
