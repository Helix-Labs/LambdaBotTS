import { Command } from '@sapphire/framework';
import { Message, EmbedBuilder } from 'discord.js';

export class ServerEmojisCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'serveremojis',
      aliases: ['emojis'],
      description: 'Shows all emojis in this server',
    });
  }

  public async messageRun(message: Message) {
    if (!message.guild) {
      return message.reply('This command can only be used in a server!');
    }

    const emojis = message.guild.emojis.cache;
    const animated = emojis.filter(emoji => emoji.animated);
    const staticEmojis = emojis.filter(emoji => !emoji.animated);

    const embed = new EmbedBuilder()
      .setTitle(`Emojis in ${message.guild.name}`)
      .setColor('Blue')
      .setTimestamp();

    if (animated.size > 0) {
      const animatedList = animated.map(emoji => emoji.toString()).join(' ');
      const truncatedAnimated = animatedList.length > 1024 ? animatedList.substring(0, 1021) + '...' : animatedList;
      embed.addFields({ name: `Animated (${animated.size})`, value: truncatedAnimated || 'None', inline: false });
    }

    if (staticEmojis.size > 0) {
      const staticList = staticEmojis.map(emoji => emoji.toString()).join(' ');
      const truncatedStatic = staticList.length > 1024 ? staticList.substring(0, 1021) + '...' : staticList;
      embed.addFields({ name: `Static (${staticEmojis.size})`, value: truncatedStatic || 'None', inline: false });
    }

    if (emojis.size === 0) {
      embed.setDescription('This server has no custom emojis.');
    }

    return message.reply({ embeds: [embed] });
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    if (!interaction.guild) {
      return interaction.reply('This command can only be used in a server!');
    }

    const emojis = interaction.guild.emojis.cache;
    const animated = emojis.filter(emoji => emoji.animated);
    const staticEmojis = emojis.filter(emoji => !emoji.animated);

    const embed = new EmbedBuilder()
      .setTitle(`Emojis in ${interaction.guild.name}`)
      .setColor('Blue')
      .setTimestamp();

    if (animated.size > 0) {
      const animatedList = animated.map(emoji => emoji.toString()).join(' ');
      const truncatedAnimated = animatedList.length > 1024 ? animatedList.substring(0, 1021) + '...' : animatedList;
      embed.addFields({ name: `Animated (${animated.size})`, value: truncatedAnimated || 'None', inline: false });
    }

    if (staticEmojis.size > 0) {
      const staticList = staticEmojis.map(emoji => emoji.toString()).join(' ');
      const truncatedStatic = staticList.length > 1024 ? staticList.substring(0, 1021) + '...' : staticList;
      embed.addFields({ name: `Static (${staticEmojis.size})`, value: truncatedStatic || 'None', inline: false });
    }

    if (emojis.size === 0) {
      embed.setDescription('This server has no custom emojis.');
    }

    return interaction.reply({ embeds: [embed] });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
    );
  }
}