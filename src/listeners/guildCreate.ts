import { Listener } from '@sapphire/framework';
import { TextChannel } from 'discord.js';

export class GuildCreateListener extends Listener<'guildCreate'> {
  public run(guild: any) {
    const auditChannel = (global as any).globalAuditsChannel as TextChannel;
    if (auditChannel) {
      auditChannel.send(`\`\`\`Added to ${guild.name}\`\`\``).catch(() => {});
    }

    const systemChannel = guild.systemChannel;
    if (systemChannel) {
      systemChannel.send('Thank you for adding me 😃').catch(() => {});
    }
  }
}