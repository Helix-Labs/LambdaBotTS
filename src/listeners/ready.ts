import { Listener } from '@sapphire/framework';
import { TextChannel, ActivityType } from 'discord.js';

export class ReadyListener extends Listener<'clientReady'> {
  private static readonly botStatusChannelID = '770225299396624394';
  private static readonly globalAuditsChannelID = '758724135790051368';

  public run() {
    this.container.logger.info('Bot is ready!');
    const client = this.container.client;

    client.user?.setStatus('dnd');

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

    const channel = client.channels.cache.get(ReadyListener.botStatusChannelID) as TextChannel;
    if (channel) {
      channel.send('`Started`').catch(() => {});
    }

    // Store audit channel
    (global as any).globalAuditsChannel = client.channels.cache.get(ReadyListener.globalAuditsChannelID) as TextChannel;
  }
}