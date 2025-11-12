import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';
import axios from 'axios';
import { Utils } from '../../utils/utils';

export class ShortenUrlCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'shortenurl',
      aliases: ['surl', 'shorturl'],
      description: 'Shortens the provided URL',
      cooldownDelay: 30000, // 30 seconds
    });
  }

  public async messageRun(message: Message) {
    const url = message.content.split(' ').slice(1).join('').trim();

    if (!url || Utils.isNotUrl(url)) {
      return message.reply('Please provide a valid URL.');
    }

    try {
      const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      const shortenedUrl = response.data;

      return message.reply(`Here's your shortened URL: ${shortenedUrl}`);
    } catch (error) {
      return message.reply('Something went wrong while shortening the URL.');
    }
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const url = interaction.options.getString('url', true);

    if (Utils.isNotUrl(url)) {
      return interaction.reply('Please provide a valid URL.');
    }

    await interaction.deferReply();

    try {
      const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      const shortenedUrl = response.data;

      return interaction.editReply(`Here's your shortened URL: ${shortenedUrl}`);
    } catch (error) {
      return interaction.editReply('Something went wrong while shortening the URL.');
    }
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription('The URL to shorten')
            .setRequired(true)
        )
    );
  }
}