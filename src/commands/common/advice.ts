import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';
import axios from 'axios';

export class AdviceCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'advice',
      description: 'Get a random piece of advice',
    });
  }

  public async messageRun(message: Message) {
    try {
      const response = await axios.get('https://api.adviceslip.com/advice');
      const advice = response.data.slip.advice;
      return message.reply(advice);
    } catch (error) {
      return message.reply('Failed to get advice');
    }
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    try {
      const response = await axios.get('https://api.adviceslip.com/advice');
      const advice = response.data.slip.advice;
      return interaction.reply(advice);
    } catch (error) {
      return interaction.reply('Failed to get advice');
    }
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('advice')
        .setDescription('Get a random piece of advice')
    );
  }
}