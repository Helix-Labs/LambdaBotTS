import { Listener } from '@sapphire/framework';
import { TextChannel } from 'discord.js';

export class GuildDeleteListener extends Listener<'guildDelete'> {
  public run(guild: any) {
    const auditChannel = (global as any).globalAuditsChannel as TextChannel;
    if (auditChannel) {
      auditChannel.send(`\`\`\`Removed from ${guild.name}\`\`\``).catch(() => {});
    }
  }
}