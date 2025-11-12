import { Command } from '@sapphire/framework';
import { Message, AttachmentBuilder } from 'discord.js';
import { createCanvas, loadImage, Canvas } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';

export class DefaultAvatarCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'defaultavatar',
      aliases: ['defaulta', 'davatar', 'da'],
      description: 'Makes you a custom Default Avatar',
      detailedDescription: 'Usage: <r>,<g>,<b> / rgb / #hex | <r>,<g>,<b> / rgb / #hex',
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1).join(' ').trim();

    if (!args) {
      return message.reply('Missing Arguments. Usage: `<r>,<g>,<b> / rgb / #hex | <r>,<g>,<b> / rgb / #hex`');
    }

    try {
      const colors = this.parseColors(args);
      const imageBuffer = await this.generateAvatar(colors.outer, colors.inner);

      const attachment = new AttachmentBuilder(imageBuffer, { name: 'NewAvatar.png' });
      return message.reply({ content: 'Generated Successfully', files: [attachment] });
    } catch (error) {
      return message.reply('Invalid color format. Use RGB values like `255,0,0` or hex codes like `#ff0000`');
    }
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const outerColor = interaction.options.getString('outer_color', true);
    const innerColor = interaction.options.getString('inner_color');

    try {
      const colors = this.parseColors(`${outerColor}${innerColor ? `|${innerColor}` : ''}`);
      const imageBuffer = await this.generateAvatar(colors.outer, colors.inner);

      const attachment = new AttachmentBuilder(imageBuffer, { name: 'NewAvatar.png' });

      return interaction.reply({ content: 'Generated Successfully', files: [attachment] });
    } catch (error) {
      return interaction.reply('Invalid color format. Use RGB values like `255,0,0` or hex codes like `#ff0000`');
    }
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option
            .setName('outer_color')
            .setDescription('Outer color (RGB like 255,0,0 or hex like #ff0000)')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('inner_color')
            .setDescription('Inner color (optional, same format as outer)')
            .setRequired(false)
        )
    );
  }

  private parseColors(args: string): { outer: string; inner: string } {
    const parts = args.split('|').map(p => p.trim());
    let outer = '#000000';
    let inner = '#ffffff';

    if (parts.length >= 1) {
      outer = this.parseColor(parts[0]);
    }

    if (parts.length >= 2) {
      inner = this.parseColor(parts[1]);
    }

    return { outer, inner };
  }

  private parseColor(colorStr: string): string {
    const trimmed = colorStr.trim();

    if (trimmed.startsWith('#')) {
      // Hex color
      const hex = trimmed.substring(1);
      if (hex.length === 3) {
        // Convert 3-digit hex to 6-digit
        return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
      }
      return trimmed;
    } else if (trimmed.includes(',')) {
      // RGB format
      const rgb = trimmed.split(',').map(s => parseInt(s.trim(), 10));
      if (rgb.length === 3 && rgb.every(n => !isNaN(n) && n >= 0 && n <= 255)) {
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      }
    } else {
      // Single number (RGB int)
      const num = parseInt(trimmed, 10);
      if (!isNaN(num)) {
        const r = (num >> 16) & 0xff;
        const g = (num >> 8) & 0xff;
        const b = num & 0xff;
        return `rgb(${r}, ${g}, ${b})`;
      }
    }

    throw new Error('Invalid color format');
  }

  private async generateAvatar(outerColor: string, innerColor: string): Promise<Buffer> {
    // Load the default avatar template
    const templatePath = path.join(__dirname, '../../../resources/images/defaultPfp.png');
    const template = await loadImage(templatePath);

    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext('2d');

    // Get image data to check pixels
    const imageData = ctx.createImageData(template.width, template.height);
    ctx.drawImage(template, 0, 0);
    const data = ctx.getImageData(0, 0, template.width, template.height).data;

    // Clear canvas and redraw with colors
    ctx.clearRect(0, 0, template.width, template.height);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Check if pixel is white (background) or black (foreground)
      // Assuming white is background, black is foreground
      const isBackground = r === 255 && g === 255 && b === 255;

      ctx.fillStyle = isBackground ? outerColor : innerColor;
      const x = (i / 4) % template.width;
      const y = Math.floor(i / 4 / template.width);
      ctx.fillRect(x, y, 1, 1);
    }

    return canvas.toBuffer('image/png');
  }
}