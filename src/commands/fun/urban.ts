import { Command } from '@sapphire/framework';
import { Message, EmbedBuilder } from 'discord.js';
import axios from 'axios';

export class UrbanCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'urban',
      description: 'Get Urban Dictionary definition',
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1);
    if (args.length === 0) {
      return message.reply('Missing arguments');
    }

    const term = args.join(' ');
    try {
      const response = await axios.get(`http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`);
      const list = response.data.list;
      if (list.length === 0) {
        return message.reply('Nothing found');
      }
      const item = list[0];
      const embed = new EmbedBuilder()
        .setTitle(term)
        .setURL(item.permalink)
        .setDescription(item.definition)
        .addFields({ name: 'Example', value: `\`\`\`${item.example}\`\`\``, inline: false })
        .setFooter({ text: `👍 ${item.thumbs_up} | 👎 ${item.thumbs_down}` })
        .setAuthor({ name: item.author });
      return message.reply({ embeds: [embed] });
    } catch (error) {
      return message.reply('Something went wrong');
    }
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const term = interaction.options.getString('term', true);
    try {
      const response = await axios.get(`http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`);
      const list = response.data.list;
      if (list.length === 0) {
        return interaction.reply('Nothing found');
      }
      const item = list[0];
      const embed = new EmbedBuilder()
        .setTitle(term)
        .setURL(item.permalink)
        .setDescription(item.definition)
        .addFields({ name: 'Example', value: `\`\`\`${item.example}\`\`\``, inline: false })
        .setFooter({ text: `👍 ${item.thumbs_up} | 👎 ${item.thumbs_down}` })
        .setAuthor({ name: item.author });
      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      return interaction.reply('Something went wrong');
    }
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('urban')
        .setDescription('Get Urban Dictionary definition')
        .addStringOption(option =>
          option.setName('term')
            .setDescription('Word to define')
            .setRequired(true)
        )
    );
  }
}