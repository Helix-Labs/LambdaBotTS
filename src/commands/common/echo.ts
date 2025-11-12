import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

export class EchoCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'echo',
      description: 'Echo your message',
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1);
    if (!args.length) {
      return message.reply('Missing arguments');
    }
    const text = args.join(' ');
    return message.reply(text);
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const text = interaction.options.getString('message', true);
    return interaction.reply(text);
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('echo')
        .setDescription('Echo your message')
        .addStringOption(option =>
          option.setName('message')
            .setDescription('The message to echo')
            .setRequired(true)
        )
    );
  }
}