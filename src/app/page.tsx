'use client';

import { useState } from 'react';
import MoodMixer from '@/components/MoodMixer';
import Player from '@/components/Player';
import UploadForm from '@/components/UploadForm';
import TopTracks from '@/components/TopTracks';

export default function Home() {
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <nav className="flex justify-between items-center mb-8">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          MusicAI DJ
        </div>
        <div className="hidden md:block text-sm text-gray-400">
          Powered by Gemini & MongoDB
        </div>
      </nav>

      <MoodMixer onMixGenerated={setCurrentPlaylist} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Player playlist={currentPlaylist} />
        </div>

        <div className="space-y-8">
          <TopTracks />
          <UploadForm onUploadSuccess={() => { /* Refresh logic if needed */ }} />
        </div>
      </div>
    </main>
  );
}
