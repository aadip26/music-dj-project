'use client';

import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

export default function TopTracks() {
    const [tracks, setTracks] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/stats/top-tracks')
            .then(res => res.json())
            .then(data => {
                if (data.data) setTracks(data.data);
            })
            .catch(console.error);
    }, []);

    if (tracks.length === 0) return null;

    return (
        <div className="glass-panel p-6 h-full">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-300">
                <TrendingUp size={18} />
                Top Tracks
            </h3>
            <div className="space-y-3">
                {tracks.map((t, i) => (
                    <div key={t._id} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
                        <div>
                            <span className="font-semibold text-gray-200">{i + 1}. {t.title}</span>
                            <p className="text-gray-500 text-xs">{t.artist}</p>
                        </div>
                        <div className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs font-mono">
                            {t.usageCount} plays
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
