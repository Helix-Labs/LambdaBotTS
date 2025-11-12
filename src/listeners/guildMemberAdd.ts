import { Listener } from '@sapphire/framework';
import { GuildMember } from 'discord.js';

export class GuildMemberAddListener extends Listener<'guildMemberAdd'> {
  public run(member: GuildMember) {
    this.container.logger.info(`${member.displayName} joined ${member.guild.name}`);
    // TODO: Send welcome message with image
  }
}