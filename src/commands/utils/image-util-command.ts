import { Command } from '@sapphire/framework';
import { Message, AttachmentBuilder } from 'discord.js';
import axios from 'axios';
import { Utils } from '../../utils/utils';

export abstract class ImageUtilCommand extends Command {
  protected abstract getUtilUrl(): string;
  protected abstract getDoneMessage(): string;

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1);
    let imageUrl: string | null = null;

    // Check for attachments
    if (message.attachments.size > 0) {
      imageUrl = message.attachments.first()!.url;
    }
    // Check for URL in args
    else if (args.length > 0 && !Utils.isNotUrl(args[0])) {
      imageUrl = args[0];
    }
    // Check for mentioned user avatar
    else if (message.mentions.users.size > 0) {
      imageUrl = message.mentions.users.first()!.displayAvatarURL({ size: 512 });
    }
    // Check for emoji
    else if (message.mentions.roles.size > 0 || message.content.includes('<:')) {
      // For emojis, we'd need to extract the emoji URL
      // For simplicity, let's skip emoji support for now
      return message.reply('Please provide an image URL or attach an image.');
    } else {
      return message.reply('Please provide an image URL or attach an image.');
    }

    if (!imageUrl) {
      return message.reply('Please provide an image URL or attach an image.');
    }

    try {
      await this.processImage(message, imageUrl);
    } catch (error) {
      return message.reply('Failed to process the image. Please try again later.');
    }
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const imageUrl = interaction.options.getString('image_url') ||
                     interaction.options.getAttachment('attachment')?.url;

    if (!imageUrl) {
      return interaction.reply('Please provide an image URL or attachment.');
    }

    await interaction.deferReply();

    try {
      await this.processImageInteraction(interaction, imageUrl);
    } catch (error) {
      return interaction.editReply('Failed to process the image. Please try again later.');
    }
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option
            .setName('image_url')
            .setDescription('URL of the image to process')
            .setRequired(false)
        )
        .addAttachmentOption((option) =>
          option
            .setName('attachment')
            .setDescription('Image attachment to process')
            .setRequired(false)
        )
    );
  }

  private async processImage(message: Message, imageUrl: string) {
    const formData = new FormData();
    formData.append('image', imageUrl);

    const response = await axios.post(
      `https://apis.duncte123.me/filters/${this.getUtilUrl()}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'arraybuffer'
      }
    );

    if (response.status === 429) {
      return message.reply("I've been rate-limited. Please try again later.");
    }

    if (response.status === 422) {
      return message.reply("Image URL provided does not exist.");
    }

    const attachment = new AttachmentBuilder(Buffer.from(response.data), { name: 'ResultImage.png' });
    return message.reply({
      content: `Here's your ${this.getDoneMessage()} image`,
      files: [attachment]
    });
  }

  private async processImageInteraction(interaction: Command.ChatInputCommandInteraction, imageUrl: string) {
    const formData = new FormData();
    formData.append('image', imageUrl);

    const response = await axios.post(
      `https://apis.duncte123.me/filters/${this.getUtilUrl()}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'arraybuffer'
      }
    );

    if (response.status === 429) {
      return interaction.editReply("I've been rate-limited. Please try again later.");
    }

    if (response.status === 422) {
      return interaction.editReply("Image URL provided does not exist.");
    }

    const attachment = new AttachmentBuilder(Buffer.from(response.data), { name: 'ResultImage.png' });
    return interaction.editReply({
      content: `Here's your ${this.getDoneMessage()} image`,
      files: [attachment]
    });
  }
}