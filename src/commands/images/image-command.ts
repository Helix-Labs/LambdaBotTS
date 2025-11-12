import { Command } from '@sapphire/framework';
import { EmbedBuilder, Message } from 'discord.js';
import axios from 'axios';
import { Images } from './images';

export abstract class ImageCommand extends Command {
  protected abstract getImageType(): Images;

  public async messageRun(message: Message) {
    try {
      const response = await axios.get(this.getImageType());
      const data = response.data;

      if (!data.success) {
        return message.reply('Something went wrong, try again later');
      }

      const imageUrl = data.data.file;

      const embed = new EmbedBuilder()
        .setImage(imageUrl)
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    } catch (error) {
      return message.reply('Failed to fetch image. Please try again later.');
    }
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();

    try {
      const response = await axios.get(this.getImageType());
      const data = response.data;

      if (!data.success) {
        return interaction.editReply('Something went wrong, try again later');
      }

      const imageUrl = data.data.file;

      const embed = new EmbedBuilder()
        .setImage(imageUrl)
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      return interaction.editReply('Failed to fetch image. Please try again later.');
    }
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
    );
  }
}