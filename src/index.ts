import 'dotenv/config';
import { SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import { DatabaseManager } from './database/DatabaseManager';
import { Config } from './config/Config';

const client = new SapphireClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    // Add more intents as needed
  ],
  loadMessageCommandListeners: true, // Enable text-based commands
});

async function main() {
  try {
    // Validate configuration
    Config.validate();

    // Connect to MongoDB
    await DatabaseManager.getInstance().connect(Config.MONGODB_URI);

    // Login to Discord
    await client.login(Config.DISCORD_TOKEN);
  } catch (error) {
    console.error('Failed to start the bot:', error);
    process.exit(1);
  }
}

main();