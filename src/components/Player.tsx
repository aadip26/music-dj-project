'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, Disc } from 'lucide-react';

interface Track {
    _id: string;
    title: string;
    artist: string;
    url: string;
    reason?: string;
    dataUri?: string; // fallback if url fails? no, url should point to it.
}

export default function Player({ playlist }: { playlist: any }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const tracks: Track[] = playlist?.tracks?.map((t: any) => ({
        ...t.track,
        reason: t.reason
    })) || [];

    const currentTrack = tracks[currentIndex];

    useEffect(() => {
        if (playlist) {
            setCurrentIndex(0);
            setIsPlaying(true); // Auto-start when new playlist loads
        }
    }, [playlist]);

    useEffect(() => {
        if (audioRef.current && currentTrack) {
            audioRef.current.src = currentTrack.url;
            if (isPlaying) audioRef.current.play().catch(e => console.log("Autoplay blocked:", e));
        }
    }, [currentIndex, currentTrack, playlist]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.play();
            else audioRef.current.pause();
        }
    }, [isPlaying]);

    if (!playlist || tracks.length === 0) return null;

    const handleNext = () => {
        if (currentIndex < tracks.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsPlaying(false);
        }
    };

    return (
        <div className="glass-panel p-6 mb-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Cover Art / Visualizer Placeholder */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg animate-[spin_4s_linear_infinite]">
                    <Disc size={48} className="text-white/80" />
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold">{currentTrack?.title}</h2>
                    <p className="text-purple-300 text-lg">{currentTrack?.artist}</p>
                    <div className="mt-2 text-sm text-gray-400 italic bg-white/5 p-2 rounded inline-block">
                        AI Choice: "{currentTrack?.reason || 'Great vibe'}"
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-4 rounded-full bg-white text-indigo-900 hover:scale-105 transition shadow-xl"
                    >
                        {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                    </button>
                    <button onClick={handleNext} className="text-white/70 hover:text-white">
                        <SkipForward size={28} />
                    </button>
                </div>
            </div>

            <audio
                ref={audioRef}
                onEnded={handleNext}
                className="hidden"
            />

            <div className="mt-6 border-t border-white/10 pt-4">
                <h3 className="text-sm font-semibold uppercase text-gray-500 mb-3">Up Next</h3>
                <div className="grid gap-2">
                    {tracks.map((t, idx) => (
                        <div
                            key={t._id}
                            onClick={() => { setCurrentIndex(idx); setIsPlaying(true); }}
                            className={`p-3 rounded cursor-pointer flex justify-between items-center transition ${idx === currentIndex ? 'bg-white/10 border-l-4 border-purple-500' : 'hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-mono text-gray-500">{idx + 1}</span>
                                <div>
                                    <div className={`font-medium ${idx === currentIndex ? 'text-purple-300' : 'text-gray-300'}`}>{t.title}</div>
                                    <div className="text-xs text-gray-500">{t.artist}</div>
                                </div>
                            </div>
                            {idx === currentIndex && <div className="text-xs text-purple-400 font-bold animate-pulse">PLAYING</div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
