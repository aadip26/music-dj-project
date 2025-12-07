
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Track from '@/models/Track';
import { statsCache } from '@/lib/cache';

const CACHE_KEY = 'top-tracks';
const TTL = 30; // 30 seconds

export async function GET() {
    try {
        const cached = statsCache.get(CACHE_KEY);
        if (cached) {
            return NextResponse.json({ ...cached, source: 'cache' });
        }

        await connectToDatabase();

        const topTracks = await Track.find({})
            .sort({ usageCount: -1 })
            .limit(5)
            .select('title artist usageCount mood');

        const result = { data: topTracks, generatedAt: new Date().toISOString() };

        statsCache.set(CACHE_KEY, result, TTL);

        return NextResponse.json({ ...result, source: 'db' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
