import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

export class RandomCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'random',
      description: 'Generate a random number between bounds',
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1);
    if (args.length === 0) {
      return message.reply('Missing arguments. Usage: random <max> or random <min> <max>');
    }

    try {
      if (args.length === 1) {
        const max = parseInt(args[0]);
        if (isNaN(max)) throw new Error();
        const num = Math.floor(Math.random() * max);
        return message.reply(`${num}`);
      } else {
        const min = parseInt(args[0]);
        const max = parseInt(args[1]);
        if (isNaN(min) || isNaN(max)) throw new Error();
        const num = Math.floor(Math.random() * (max - min)) + min;
        return message.reply(`${num}`);
      }
    } catch {
      return message.reply('Invalid input! Provide numbers');
    }
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const min = interaction.options.getInteger('min');
    const max = interaction.options.getInteger('max', true);

    if (min !== null) {
      const num = Math.floor(Math.random() * (max - min)) + min;
      return interaction.reply(`${num}`);
    } else {
      const num = Math.floor(Math.random() * max);
      return interaction.reply(`${num}`);
    }
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('random')
        .setDescription('Generate a random number')
        .addIntegerOption(option =>
          option.setName('max')
            .setDescription('Maximum number (or upper bound)')
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option.setName('min')
            .setDescription('Minimum number (lower bound)')
            .setRequired(false)
        )
    );
  }
}