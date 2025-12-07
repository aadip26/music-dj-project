import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITrack extends Document {
    title: string;
    artist: string;
    album?: string;
    mood: string; // The mood description or tags
    filename: string;
    url: string; // URL for streaming (local /uploads/... or external)
    dataUri?: string; // Optional: base64 data for small files (DB storage fallback)
    duration: number; // in seconds
    usageCount: number;
    createdAt: Date;
}

const TrackSchema: Schema = new Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String },
    mood: { type: String, required: true },
    filename: { type: String, required: true },
    url: { type: String, required: true },
    dataUri: { type: String },
    duration: { type: Number, default: 0 },
    usageCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

// Prevent overwrite on HMR
const Track: Model<ITrack> = mongoose.models.Track || mongoose.model<ITrack>('Track', TrackSchema);

export default Track;
