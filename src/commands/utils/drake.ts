import { Command } from '@sapphire/framework';
import { Message, AttachmentBuilder } from 'discord.js';
import axios from 'axios';

export class DrakeCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'drake',
      description: 'Generates a drake meme',
      detailedDescription: 'Usage: <top_text> | <bottom_text>',
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1).join(' ').trim();
    const parts = args.split('|').map(p => p.trim());

    if (parts.length < 2 || !parts[0] || !parts[1]) {
      return message.reply('Please provide both top and bottom text separated by `|`. Usage: `drake <top_text> | <bottom_text>`');
    }

    try {
      await this.generateMeme(message, parts[0], parts[1]);
    } catch (error) {
      return message.reply('Failed to generate meme. Please try again later.');
    }
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const topText = interaction.options.getString('top_text', true);
    const bottomText = interaction.options.getString('bottom_text', true);

    await interaction.deferReply();

    try {
      await this.generateMemeInteraction(interaction, topText, bottomText);
    } catch (error) {
      return interaction.editReply('Failed to generate meme. Please try again later.');
    }
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option
            .setName('top_text')
            .setDescription('Text for the top panel')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('bottom_text')
            .setDescription('Text for the bottom panel')
            .setRequired(true)
        )
    );
  }

  private async generateMeme(message: Message, top: string, bottom: string) {
    const formData = new FormData();
    formData.append('top', top);
    formData.append('bottom', bottom);

    const response = await axios.post(
      'https://apis.duncte123.me/memes/drakememe/',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'arraybuffer'
      }
    );

    if (response.status === 429) {
      return message.reply("I've been rate-limited. Please try again later.");
    }

    const attachment = new AttachmentBuilder(Buffer.from(response.data), { name: 'DrakeMeme.png' });
    return message.reply({
      content: 'Generated Successfully',
      files: [attachment]
    });
  }

  private async generateMemeInteraction(interaction: Command.ChatInputCommandInteraction, top: string, bottom: string) {
    const formData = new FormData();
    formData.append('top', top);
    formData.append('bottom', bottom);

    const response = await axios.post(
      'https://apis.duncte123.me/memes/drakememe/',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'arraybuffer'
      }
    );

    if (response.status === 429) {
      return interaction.editReply("I've been rate-limited. Please try again later.");
    }

    const attachment = new AttachmentBuilder(Buffer.from(response.data), { name: 'DrakeMeme.png' });
    return interaction.editReply({
      content: 'Generated Successfully',
      files: [attachment]
    });
  }
}