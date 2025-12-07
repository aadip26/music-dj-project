import { GoogleGenerativeAI } from '@google/generative-ai';
import { ITrack } from '@/models/Track';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generatePlaylistFromMood(moodPrompt: string, availableTracks: ITrack[]) {
    if (!genAI) {
        console.warn("GEMINI_API_KEY not found. Returning random tracks.");
        // Fallback: Random 3 tracks
        return availableTracks
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map((t, i) => ({ trackId: t._id, order: i + 1, reason: "Random fallback" }));
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare track list for LLM
    const tracksInfo = availableTracks.map(t => ({
        id: t._id.toString(),
        title: t.title,
        artist: t.artist,
        mood: t.mood
    }));

    const prompt = `
    You are a professional DJ. The user wants a music mix for the mood: "${moodPrompt}".
    
    Here are the available tracks:
    ${JSON.stringify(tracksInfo)}
    
    Select 3 to 6 tracks that best fit the mood.
    Return a JSON array of objects, where each object has:
    - "id": The track ID from the list.
    - "reason": A short explanation of why it fits.
    
    Sort them in a logical playback order.
    Output ONLY valid JSON. No markdown code blocks.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up potential markdown formatting
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const selection = JSON.parse(text);

        if (!Array.isArray(selection)) {
            throw new Error("Invalid format from AI");
        }

        return selection.map((item: any, index: number) => ({
            trackId: item.id,
            order: index + 1,
            reason: item.reason
        }));

    } catch (error) {
        console.error("AI Playlist Generation Failed:", error);
        // Fallback
        return availableTracks.slice(0, 3).map((t, i) => ({ trackId: t._id, order: i + 1, reason: "Fallback after error" }));
    }
}
