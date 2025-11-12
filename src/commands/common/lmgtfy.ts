import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

export class LMGTFYCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'lmgtfy',
      aliases: ['google'],
      description: 'Let me Google that for you',
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1);
    if (args.length === 0) {
      return message.reply('Missing arguments');
    }
    const query = args.join('+');
    return message.reply(`http://lmgtfy.com/?q=${query}`);
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const query = interaction.options.getString('query', true);
    return interaction.reply(`http://lmgtfy.com/?q=${query.replace(/\s+/g, '+')}`);
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('lmgtfy')
        .setDescription('Let me Google that for you')
        .addStringOption(option =>
          option.setName('query')
            .setDescription('What to search')
            .setRequired(true)
        )
    );
  }
}