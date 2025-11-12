import { Command } from '@sapphire/framework';
import { EmbedBuilder, Message } from 'discord.js';
import axios from 'axios';

export class CatCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'cat',
      description: 'Gives random image of cats UwU',
    });
  }

  public async messageRun(message: Message) {
    try {
      const response = await axios.get('https://nekos.life/api/v2/img/meow');
      const imageUrl = response.data.url;

      const embed = new EmbedBuilder()
        .setImage(imageUrl)
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    } catch (error) {
      return message.reply('Failed to fetch cat image. Please try again later.');
    }
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();

    try {
      const response = await axios.get('https://nekos.life/api/v2/img/meow');
      const imageUrl = response.data.url;

      const embed = new EmbedBuilder()
        .setImage(imageUrl)
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      return interaction.editReply('Failed to fetch cat image. Please try again later.');
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