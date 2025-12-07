'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

export default function UploadForm({ onUploadSuccess }: { onUploadSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch('/api/tracks', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error || 'Upload failed');
            }

            (e.target as HTMLFormElement).reset();
            onUploadSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Upload size={20} />
                Upload Track
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Title</label>
                    <input name="title" required className="w-full p-2 rounded glass-input" placeholder="Song Title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Artist</label>
                        <input name="artist" required className="w-full p-2 rounded glass-input" placeholder="Artist" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Mood Tag</label>
                        <input name="mood" required className="w-full p-2 rounded glass-input" placeholder="e.g. Happy, Chill" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Audio File</label>
                    <input type="file" name="file" accept="audio/*" required className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button disabled={loading} className="w-full py-2 rounded-lg font-bold glass-button disabled:opacity-50">
                    {loading ? 'Uploading...' : 'Add to Library'}
                </button>
            </form>
        </div>
    );
}
