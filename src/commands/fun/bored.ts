import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';
import axios from 'axios';

export class BoredCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'bored',
      description: 'Get a random activity for when you\'re bored',
    });
  }

  public async messageRun(message: Message) {
    try {
      const response = await axios.get('http://www.boredapi.com/api/activity/');
      const activity = response.data.activity;
      return message.reply(activity);
    } catch (error) {
      return message.reply('Couldn\'t fetch an activity right now');
    }
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    try {
      const response = await axios.get('http://www.boredapi.com/api/activity/');
      const activity = response.data.activity;
      return interaction.reply(activity);
    } catch (error) {
      return interaction.reply('Couldn\'t fetch an activity right now');
    }
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('bored')
        .setDescription('Get a random activity for when you\'re bored')
    );
  }
}