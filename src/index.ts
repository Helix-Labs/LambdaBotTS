import { SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';

const client = new SapphireClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    // Add more intents as needed
  ],
  loadMessageCommandListeners: true, // Enable text-based commands
});

client.login(process.env.DISCORD_TOKEN);