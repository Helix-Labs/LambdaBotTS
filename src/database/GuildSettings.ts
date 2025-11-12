import mongoose, { Schema, Document } from 'mongoose';

export interface IGuildSettings extends Document {
  guildId: string;
  prefix: string;
  welcomeChannelId: string;
  welcomeMessage: string;
  welcomeBackground: string;
}

const GuildSettingsSchema = new Schema<IGuildSettings>({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '/' },
  welcomeChannelId: { type: String, default: '' },
  welcomeMessage: { type: String, default: 'Welcome {user} to {guild}!' },
  welcomeBackground: { type: String, default: 'default' }
});

export const GuildSettings = mongoose.model<IGuildSettings>('GuildSettings', GuildSettingsSchema);