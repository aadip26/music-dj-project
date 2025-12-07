# Music-based Mood DJ

A Smart DJ application that creates mood-based playlists using AI (Google Gemini).

## Features
- **Smart Mix Generation**: Enter a mood (e.g., "Calm coding", "Workout energy") and get a curated playlist from your library.
- **Music Upload**: Upload MP3/WAV files to build your library.
- **Top Tracks**: See which tracks are selected most often by the AI.
- **Full Player**: Continuous playback of generated mixes.

## Visuals
- Modern Glassmorphism UI
- Responsive Design

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: MongoDB (Mongoose)
- **AI**: Google Gemini (via `@google/generative-ai`)
- **Styling**: Tailwind CSS
- **Cache**: In-memory TTL cache for stats.

## Setup & installation

> **Note**: This project requires active MongoDB and Gemini API keys.

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root:
   ```bash
   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/music-dj
   GEMINI_API_KEY=AIzaSy...
   # Optional: Force DB storage for small files (Demo Mode)
   NEXT_PUBLIC_DEMO_MODE=true
   ```

3. **Run Locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

4. **Upload Music**
   - Use the "Upload Track" form.
   - For a **Vercel Demo** without external storage (S3/Cloudinary), the app is configured to store *small* files (<5MB) directly in MongoDB as Base64 data URIs.
   - For local use, it saves to `./public/music`.

## Architecture Highlights
- **Backend**: API Routes in `src/app/api` handle logic.
- **AI Agent**: `src/lib/ai.ts` specifically prompts Gemini to select *and order* tracks based on mood.
- **Caching**: `src/api/stats/top-tracks` uses an in-memory cache to reduce DB load for popular stats.

## Evaluation Notes
- **Disk Space**: If you encounter `ENOSPC` errors during install, please ensure you have at least 500MB free space.
- **Vercel Deployment**: This project is Vercel-ready. Ensure environment variables are set in the Vercel dashboard.
