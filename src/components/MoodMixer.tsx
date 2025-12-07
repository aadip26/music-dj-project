'use client';

import { useState } from 'react';
import { Wand2 } from 'lucide-react';

export default function MoodMixer({ onMixGenerated }: { onMixGenerated: (playlist: any) => void }) {
    const [mood, setMood] = useState('');
    const [loading, setLoading] = useState(false);

    async function generateMix() {
        if (!mood) return;
        setLoading(true);
        try {
            const res = await fetch('/api/generate-mix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            onMixGenerated(data);
        } catch (e) {
            alert("Failed to generate mix. Do you have tracks uploaded?");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="glass-panel p-8 text-center mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 z-0"></div>
            <div className="relative z-10">
                <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-400">
                    AI Mood DJ
                </h1>
                <p className="text-gray-300 mb-6">Describe your vibe, and I'll drop the beat.</p>

                <div className="flex max-w-lg mx-auto gap-2">
                    <input
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        placeholder="e.g. 'Late night coding session' or 'Pump up gym workout'"
                        className="flex-1 p-3 rounded-lg glass-input text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onKeyDown={(e) => e.key === 'Enter' && generateMix()}
                    />
                    <button
                        onClick={generateMix}
                        disabled={loading}
                        className="px-6 py-3 rounded-lg font-bold glass-button flex items-center gap-2 whitespace-nowrap"
                    >
                        {loading ? <span className="animate-spin">✨</span> : <Wand2 size={20} />}
                        {loading ? 'Mixing...' : 'Generate Mix'}
                    </button>
                </div>
            </div>
        </div>
    );
}
