import { Command } from '@sapphire/framework';
import { Message, EmbedBuilder } from 'discord.js';
import axios from 'axios';

export class PasteCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'paste',
      description: 'Creates a paste with the provided text',
      detailedDescription: 'Usage: <language> <text>',
      cooldownDelay: 60000, // 60 seconds
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ');
    const language = args[1];
    const content = args.slice(2).join(' ');

    if (!language || !content) {
      return message.reply('Missing Arguments. Usage: `paste <language> <text>`');
    }

    try {
      // Using hastebin API
      const response = await axios.post('https://hastebin.com/documents', content, {
        headers: { 'Content-Type': 'text/plain' }
      });

      const pasteId = response.data.key;
      const pasteUrl = `https://hastebin.com/${pasteId}`;

      const embed = new EmbedBuilder()
        .setTitle(`Paste ${pasteId}`)
        .setURL(pasteUrl)
        .setDescription(`\`\`\`${language}\n${content.length > 1000 ? content.substring(0, 1000) + '...' : content}\n\`\`\``)
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    } catch (error) {
      return message.reply('Failed to create paste. Please try again later.');
    }
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const language = interaction.options.getString('language', true);
    const content = interaction.options.getString('content', true);

    await interaction.deferReply();

    try {
      const response = await axios.post('https://hastebin.com/documents', content, {
        headers: { 'Content-Type': 'text/plain' }
      });

      const pasteId = response.data.key;
      const pasteUrl = `https://hastebin.com/${pasteId}`;

      const embed = new EmbedBuilder()
        .setTitle(`Paste ${pasteId}`)
        .setURL(pasteUrl)
        .setDescription(`\`\`\`${language}\n${content.length > 1000 ? content.substring(0, 1000) + '...' : content}\n\`\`\``)
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      return interaction.editReply('Failed to create paste. Please try again later.');
    }
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option
            .setName('language')
            .setDescription('The programming language for syntax highlighting')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('content')
            .setDescription('The content to paste')
            .setRequired(true)
        )
    );
  }
}