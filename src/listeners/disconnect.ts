import { Listener } from '@sapphire/framework';
import { TextChannel } from 'discord.js';

export class DisconnectListener extends Listener<'shardDisconnect'> {
  private static readonly botStatusChannelID = '770225299396624394';

  public run() {
    this.container.logger.info('Disconnected');
    const channel = this.container.client.channels.cache.get(DisconnectListener.botStatusChannelID) as TextChannel;
    if (channel) {
      channel.send('`Disconnected`').catch(() => {});
    }
  }
}