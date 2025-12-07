
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Track from '@/models/Track';
import Playlist from '@/models/Playlist';
import { generatePlaylistFromMood } from '@/lib/ai';

export async function POST(request: Request) {
    try {
        const { mood } = await request.json();

        if (!mood) {
            return NextResponse.json({ error: 'Mood is required' }, { status: 400 });
        }

        await connectToDatabase();

        // 1. Get all tracks
        const allTracks = await Track.find({});
        if (allTracks.length === 0) {
            return NextResponse.json({ error: 'No tracks available' }, { status: 404 });
        }

        // 2. Call LLM
        const selectedItems = await generatePlaylistFromMood(mood, allTracks);

        // 3. Create Playlist in DB
        const playlistCalls = selectedItems.map(item => ({
            track: item.trackId,
            order: item.order,
            reason: item.reason
        }));

        const playlist = await Playlist.create({
            moodPrompt: mood,
            tracks: playlistCalls
        });

        // 4. Update usage counts
        const trackIds = selectedItems.map(i => i.trackId);
        await Track.updateMany(
            { _id: { $in: trackIds } },
            { $inc: { usageCount: 1 } }
        );

        // 5. Populate and return
        const populatedPlaylist = await Playlist.findById(playlist._id).populate('tracks.track');

        return NextResponse.json(populatedPlaylist);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to generate mix' }, { status: 500 });
    }
}
