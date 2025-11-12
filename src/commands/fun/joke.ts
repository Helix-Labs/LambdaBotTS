import { Command } from '@sapphire/framework';
import { Message, EmbedBuilder } from 'discord.js';
import axios from 'axios';

export class JokeCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'joke',
      description: 'Get a random joke',
    });
  }

  public async messageRun(message: Message) {
    try {
      const response = await axios.get('http://apis.duncte123.me/joke');
      const data = response.data.data;
      const embed = new EmbedBuilder()
        .setTitle(data.title)
        .setURL(data.url)
        .setDescription(data.body);
      return message.reply({ embeds: [embed] });
    } catch (error) {
      return message.reply('Something went wrong, try again later');
    }
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    try {
      const response = await axios.get('http://apis.duncte123.me/joke');
      const data = response.data.data;
      const embed = new EmbedBuilder()
        .setTitle(data.title)
        .setURL(data.url)
        .setDescription(data.body);
      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      return interaction.reply('Something went wrong, try again later');
    }
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('joke')
        .setDescription('Get a random joke')
    );
  }
}