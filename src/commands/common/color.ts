import { Command } from '@sapphire/framework';
import { Message, AttachmentBuilder } from 'discord.js';
import { createCanvas } from 'canvas';

export class ColorCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'color',
      description: 'Generate a color image',
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1);
    if (args.length === 0) {
      return message.reply('Missing arguments. Usage: color <hex> or color <r> <g> <b>');
    }

    let color: string;
    try {
      if (args.length === 1) {
        if (args[0].startsWith('#')) {
          color = args[0];
        } else {
          const num = parseInt(args[0]);
          color = `#${num.toString(16).padStart(6, '0')}`;
        }
      } else if (args.length === 3) {
        const r = parseInt(args[0]);
        const g = parseInt(args[1]);
        const b = parseInt(args[2]);
        color = `rgb(${r}, ${g}, ${b})`;
      } else {
        throw new Error();
      }
    } catch {
      return message.reply('Invalid arguments. Provide hex or r g b values');
    }

    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 100, 100);

    ctx.fillStyle = color;
    ctx.fillRect(10, 10, 80, 80);

    const buffer = canvas.toBuffer('image/png');
    const attachment = new AttachmentBuilder(buffer, { name: 'color.png' });

    return message.reply({ files: [attachment] });
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const hex = interaction.options.getString('hex');
    const r = interaction.options.getInteger('r');
    const g = interaction.options.getInteger('g');
    const b = interaction.options.getInteger('b');

    let color: string;
    if (hex) {
      color = hex.startsWith('#') ? hex : `#${hex}`;
    } else if (r !== null && g !== null && b !== null) {
      color = `rgb(${r}, ${g}, ${b})`;
    } else {
      return interaction.reply('Provide hex or r g b values');
    }

    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 100, 100);

    ctx.fillStyle = color;
    ctx.fillRect(10, 10, 80, 80);

    const buffer = canvas.toBuffer('image/png');
    const attachment = new AttachmentBuilder(buffer, { name: 'color.png' });

    return interaction.reply({ files: [attachment] });
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('color')
        .setDescription('Generate a color image')
        .addStringOption(option =>
          option.setName('hex')
            .setDescription('Hex color code (e.g. #ff0000)')
            .setRequired(false)
        )
        .addIntegerOption(option =>
          option.setName('r')
            .setDescription('Red value (0-255)')
            .setRequired(false)
        )
        .addIntegerOption(option =>
          option.setName('g')
            .setDescription('Green value (0-255)')
            .setRequired(false)
        )
        .addIntegerOption(option =>
          option.setName('b')
            .setDescription('Blue value (0-255)')
            .setRequired(false)
        )
    );
  }
}