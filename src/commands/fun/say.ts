import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

export class SayCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'say',
      description: 'Say something',
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1);
    if (args.length === 0) {
      return message.reply('Missing arguments');
    }
    const text = args.join(' ');
    return (message.channel as any).send(text);
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const text = interaction.options.getString('message', true);
    return interaction.reply(text);
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('say')
        .setDescription('Say something')
        .addStringOption(option =>
          option.setName('message')
            .setDescription('The message to say')
            .setRequired(true)
        )
    );
  }
}