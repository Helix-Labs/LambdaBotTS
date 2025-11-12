import { Listener } from '@sapphire/framework';
import { TextChannel } from 'discord.js';

export class ReadyListener extends Listener<'ready'> {
  private static readonly botStatusChannelID = '770225299396624394';

  public run() {
    this.container.logger.info('Bot is ready!');
    const channel = this.container.client.channels.cache.get(ReadyListener.botStatusChannelID) as TextChannel;
    if (channel) {
      channel.send('`Started`').catch(() => {});
    }
  }
}