import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

export class UptimeCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'uptime',
      description: 'Shows the current uptime of the bot',
    });
  }

  public async messageRun(message: Message) {
    const uptime = this.formatUptime(process.uptime());
    return message.reply(`My Uptime is \`${uptime}\``);
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const uptime = this.formatUptime(process.uptime());
    return interaction.reply(`My Uptime is \`${uptime}\``);
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
    , {
      idHints: ['1438118853715689533']
    });
  }

  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
  }
}