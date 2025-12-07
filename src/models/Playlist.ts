import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlaylistItem {
    track: mongoose.Types.ObjectId;
    order: number;
    reason?: string; // Why AI picked this
}

export interface IPlaylist extends Document {
    moodPrompt: string;
    tracks: IPlaylistItem[];
    createdAt: Date;
}

const PlaylistSchema: Schema = new Schema({
    moodPrompt: { type: String, required: true },
    tracks: [{
        track: { type: Schema.Types.ObjectId, ref: 'Track', required: true },
        order: { type: Number, required: true },
        reason: { type: String }
    }],
    createdAt: { type: Date, default: Date.now },
});

const Playlist: Model<IPlaylist> = mongoose.models.Playlist || mongoose.model<IPlaylist>('Playlist', PlaylistSchema);

export default Playlist;
