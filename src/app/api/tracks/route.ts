
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Track from '@/models/Track';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        await connectToDatabase();
        const tracks = await Track.find({}).sort({ createdAt: -1 });
        return NextResponse.json(tracks);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const title = formData.get('title') as string;
        const artist = formData.get('artist') as string;
        const mood = formData.get('mood') as string;

        if (!file || !title || !artist || !mood) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        await connectToDatabase();

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

        // Determine storage strategy
        // For Vercel demo without external storage, we might store small files in DB (DataURI)
        // For local dev, we store in public folder.

        let url = '';
        let dataUri = undefined;

        // Check if we are running effectively in a read-only environment or if explicitly requested
        const useDbStorage = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && buffer.length < 5 * 1024 * 1024; // < 5MB

        if (useDbStorage) {
            const base64 = buffer.toString('base64');
            const mime = file.type || 'audio/mpeg';
            dataUri = `data:${mime};base64,${base64}`;
            url = dataUri; // Use data URI as URL
        } else {
            // Local file storage
            const uploadDir = path.join(process.cwd(), 'public', 'music');
            try {
                await mkdir(uploadDir, { recursive: true });
                await writeFile(path.join(uploadDir, filename), buffer);
                url = `/music/${filename}`;
            } catch (e) {
                console.error("File write error (likely read-only fs):", e);
                // Fallback to DB storage if local write fails and file is small enough
                if (buffer.length < 10 * 1024 * 1024) {
                    const base64 = buffer.toString('base64');
                    const mime = file.type || 'audio/mpeg';
                    dataUri = `data:${mime};base64,${base64}`;
                    url = dataUri;
                } else {
                    return NextResponse.json({ error: 'File too large for database storage in this demo environment.' }, { status: 500 });
                }
            }
        }

        const track = await Track.create({
            title,
            artist,
            mood,
            filename,
            url,
            dataUri, // Store if used
            usageCount: 0,
        });

        return NextResponse.json(track);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
