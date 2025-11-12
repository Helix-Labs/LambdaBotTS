import { Command } from '@sapphire/framework';
import { Message, AttachmentBuilder } from 'discord.js';
import { createCanvas } from 'canvas';

export class PixelCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'pixel',
      description: 'Generate a random pixel image',
    });
  }

  public async messageRun(message: Message) {
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');

    for (let x = 0; x < 200; x++) {
      for (let y = 0; y < 200; y++) {
        const color = `rgb(${Math.random() * 256 | 0}, ${Math.random() * 256 | 0}, ${Math.random() * 256 | 0})`;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    const buffer = canvas.toBuffer('image/png');
    const attachment = new AttachmentBuilder(buffer, { name: 'pixel.png' });
    return message.reply({ files: [attachment] });
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');

    for (let x = 0; x < 200; x++) {
      for (let y = 0; y < 200; y++) {
        const color = `rgb(${Math.random() * 256 | 0}, ${Math.random() * 256 | 0}, ${Math.random() * 256 | 0})`;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    const buffer = canvas.toBuffer('image/png');
    const attachment = new AttachmentBuilder(buffer, { name: 'pixel.png' });
    return interaction.reply({ files: [attachment] });
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('pixel')
        .setDescription('Generate a random pixel image')
    );
  }
}