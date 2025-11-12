import { Listener } from '@sapphire/framework';
import { TextChannel } from 'discord.js';

export class ReconnectListener extends Listener<'shardReconnecting'> {
  private static readonly botStatusChannelID = '770225299396624394';

  public run() {
    this.container.logger.info('Reconnected');
    const channel = this.container.client.channels.cache.get(ReconnectListener.botStatusChannelID) as TextChannel;
    if (channel) {
      channel.send('`Reconnected`').catch(() => {});
    }
  }
}