import { Listener } from '@sapphire/framework';
import { TextChannel } from 'discord.js';

export class GuildBanAddListener extends Listener<'guildBanAdd'> {
  public run(ban: any) {
    const auditChannel = (global as any).globalAuditsChannel as TextChannel;
    if (auditChannel) {
      auditChannel.send(`\`\`\`Banned from ${ban.guild.name}\`\`\``).catch(() => {});
    }
  }
}