import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';
import axios from 'axios';

export class ChatCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'chat',
      description: 'Chat with the bot',
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1);
    if (args.length === 0) {
      return message.reply('Missing arguments');
    }

    const msg = args.join(' ');
    try {
      const response = await axios.get(`https://api.snowflakedev.xyz/chatbot?message=${encodeURIComponent(msg)}`);
      const reply = response.data.message;
      return message.reply(reply);
    } catch (error) {
      return message.reply('Couldn\'t chat right now');
    }
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const msg = interaction.options.getString('message', true);
    try {
      const response = await axios.get(`https://api.snowflakedev.xyz/chatbot?message=${encodeURIComponent(msg)}`);
      const reply = response.data.message;
      return interaction.reply(reply);
    } catch (error) {
      return interaction.reply('Couldn\'t chat right now');
    }
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('chat')
        .setDescription('Chat with the bot')
        .addStringOption(option =>
          option.setName('message')
            .setDescription('Your message')
            .setRequired(true)
        )
    );
  }
}