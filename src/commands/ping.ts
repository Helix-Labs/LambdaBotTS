import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

export class PingCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'ping',
      description: 'Ping the bot',
    });
  }

  public async messageRun(message: Message) {
    return message.reply('Pong!');
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    return interaction.reply('Pong!');
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('ping').setDescription('Ping the bot')
    );
  }
}