import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

export class GenPassCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'genpass',
      aliases: ['generatepass', 'password'],
      description: 'Generate a random password',
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1);
    if (args.length === 0) {
      return message.reply('Missing arguments. Usage: genpass <length> [dm]');
    }

    try {
      const len = parseInt(args[0]);
      if (len >= 51) {
        return message.reply('Password length cannot exceed 50');
      }

      const password = Array.from({ length: len }, () =>
        String.fromCharCode(Math.floor(Math.random() * 93) + 33)
      ).join('');

      const sendDM = args[1] && args[1].toLowerCase() === 'dm';

      if (sendDM) {
        await message.author.send(`Here's your password:\n\`\`\`${password}\`\`\``);
        return message.reply('Password sent in DM');
      } else {
        return message.reply(`Here's your password:\n\`\`\`${password}\`\`\``);
      }
    } catch {
      return message.reply('Enter a number for the length');
    }
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const len = interaction.options.getInteger('length', true);
    const sendDM = interaction.options.getBoolean('dm') || false;

    if (len >= 51) {
      return interaction.reply('Password length cannot exceed 50');
    }

    const password = Array.from({ length: len }, () =>
      String.fromCharCode(Math.floor(Math.random() * 93) + 33)
    ).join('');

    if (sendDM) {
      await interaction.user.send(`Here's your password:\n\`\`\`${password}\`\`\``);
      return interaction.reply('Password sent in DM');
    } else {
      return interaction.reply(`Here's your password:\n\`\`\`${password}\`\`\``);
    }
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('genpass')
        .setDescription('Generate a random password')
        .addIntegerOption(option =>
          option.setName('length')
            .setDescription('Length of the password (max 50)')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(50)
        )
        .addBooleanOption(option =>
          option.setName('dm')
            .setDescription('Send password in DM')
            .setRequired(false)
        )
    );
  }
}