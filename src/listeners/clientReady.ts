import { Listener } from '@sapphire/framework';
import { TextChannel, ActivityType } from 'discord.js';
import { Config } from '../config/Config';

export class ReadyListener extends Listener<'ready'> {
  private statusChannel: TextChannel | null = null;

  public async run() {
    this.container.logger.info('Bot is ready and connected to Discord!');
    const client = this.container.client;

    // Set bot status
    client.user?.setStatus('dnd');

    // Set up rotating status messages
    const link = 'https://www.youtube.com/watch?v=9X0YRWmQO0E';
    const statuses = [
      'Effortless discord.js EPISODE 4 OUT!!!',
      `in ${client.guilds.cache.size} servers`
    ];

    let index = 0;
    setInterval(() => {
      client.user?.setActivity(statuses[index], { type: ActivityType.Streaming, url: link });
      index = (index + 1) % statuses.length;
    }, 30000);

    // Send status message to configured channel
    if (Config.BOT_STATUS_CHANNEL_ID) {
      try {
        const channel = await client.channels.fetch(Config.BOT_STATUS_CHANNEL_ID);
        if (channel?.isTextBased()) {
          this.statusChannel = channel as TextChannel;
          await this.statusChannel.send('`Started`');
        }
      } catch (error) {
        this.container.logger.warn('Could not find or access bot status channel:', error);
      }
    }

    // Store global audit channel if needed
    // (global as any).globalAuditsChannel = client.channels.cache.get('758724135790051368') as TextChannel;
  }
}