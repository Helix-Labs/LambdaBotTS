import mongoose from 'mongoose';
import { GuildSettings, IGuildSettings } from './GuildSettings';

export class DatabaseManager {
  private static instance: DatabaseManager;

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async connect(uri: string): Promise<void> {
    try {
      await mongoose.connect(uri);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }

  public async getPrefix(guildId: string): Promise<string> {
    const settings = await this.getGuildSettings(guildId);
    return settings.prefix;
  }

  public async setPrefix(guildId: string, prefix: string): Promise<void> {
    await GuildSettings.findOneAndUpdate(
      { guildId },
      { prefix },
      { upsert: true, new: true }
    );
  }

  public async getWelcomeChannelId(guildId: string): Promise<string> {
    const settings = await this.getGuildSettings(guildId);
    return settings.welcomeChannelId;
  }

  public async setWelcomeChannelId(guildId: string, channelId: string): Promise<void> {
    await GuildSettings.findOneAndUpdate(
      { guildId },
      { welcomeChannelId: channelId },
      { upsert: true, new: true }
    );
  }

  public async getWelcomeMessage(guildId: string): Promise<string> {
    const settings = await this.getGuildSettings(guildId);
    return settings.welcomeMessage;
  }

  public async setWelcomeMessage(guildId: string, message: string): Promise<void> {
    await GuildSettings.findOneAndUpdate(
      { guildId },
      { welcomeMessage: message },
      { upsert: true, new: true }
    );
  }

  public async getWelcomeBackground(guildId: string): Promise<string> {
    const settings = await this.getGuildSettings(guildId);
    return settings.welcomeBackground;
  }

  public async setWelcomeBackground(guildId: string, background: string): Promise<void> {
    await GuildSettings.findOneAndUpdate(
      { guildId },
      { welcomeBackground: background },
      { upsert: true, new: true }
    );
  }

  public async getWelcomeSettings(guildId: string): Promise<{ message: string; channelId: string; background: string }> {
    const settings = await this.getGuildSettings(guildId);
    return {
      message: settings.welcomeMessage,
      channelId: settings.welcomeChannelId,
      background: settings.welcomeBackground
    };
  }

  public async updateGuildSetting(guildId: string, key: string, value: string): Promise<void> {
    const updateObj: any = {};
    updateObj[key] = value;
    await GuildSettings.findOneAndUpdate(
      { guildId },
      updateObj,
      { upsert: true, new: true }
    );
  }
}