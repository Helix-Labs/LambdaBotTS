import { Command } from '@sapphire/framework';
import { Message, EmbedBuilder, User, GuildMember, Role, Channel, GuildEmoji, Sticker } from 'discord.js';

export class IDCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'id',
      description: 'Shows the ID of a user, channel, role, emoji, or sticker',
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1).join(' ');

    if (!args) {
      const embed = new EmbedBuilder()
        .setTitle('ID Information')
        .addFields(
          { name: 'Your ID', value: message.author.id, inline: true },
          { name: 'Channel ID', value: message.channel.id, inline: true },
          { name: 'Guild ID', value: message.guild?.id || 'N/A', inline: true }
        )
        .setColor('Blue')
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }

    // Parse mentions
    const user = message.mentions.users.first();
    const member = message.mentions.members?.first();
    const role = message.mentions.roles.first();
    const channel = message.mentions.channels.first();

    // Check for emoji
    const emojiMatch = args.match(/<a?:(\w+):(\d+)>/);
    const emoji = emojiMatch ? message.guild?.emojis.cache.get(emojiMatch[2]) : null;

    // Check for sticker
    const sticker = message.stickers.first();

    const embed = new EmbedBuilder()
      .setTitle('ID Information')
      .setColor('Blue')
      .setTimestamp();

    if (user) {
      embed.addFields({ name: 'User ID', value: user.id, inline: true });
    }
    if (member && member !== message.member) {
      embed.addFields({ name: 'Member ID', value: member.id, inline: true });
    }
    if (role) {
      embed.addFields({ name: 'Role ID', value: role.id, inline: true });
    }
    if (channel) {
      embed.addFields({ name: 'Channel ID', value: channel.id, inline: true });
    }
    if (emoji) {
      embed.addFields({ name: 'Emoji ID', value: emoji.id!, inline: true });
    }
    if (sticker) {
      embed.addFields({ name: 'Sticker ID', value: sticker.id, inline: true });
    }

    if (embed.data.fields?.length === 0) {
      embed.setDescription('No valid mentions found. Mention a user, channel, role, emoji, or sticker to get their ID.');
    }

    return message.reply({ embeds: [embed] });
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user');
    const channel = interaction.options.getChannel('channel');
    const role = interaction.options.getRole('role');

    const embed = new EmbedBuilder()
      .setTitle('ID Information')
      .setColor('Blue')
      .setTimestamp();

    if (user) {
      embed.addFields({ name: 'User ID', value: user.id, inline: true });
    }
    if (channel) {
      embed.addFields({ name: 'Channel ID', value: channel.id, inline: true });
    }
    if (role) {
      embed.addFields({ name: 'Role ID', value: role.id, inline: true });
    }

    if (embed.data.fields?.length === 0) {
      embed.setDescription('No options provided. Use the slash command options to get IDs.');
    }

    return interaction.reply({ embeds: [embed] });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('The user to get the ID of')
            .setRequired(false)
        )
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('The channel to get the ID of')
            .setRequired(false)
        )
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('The role to get the ID of')
            .setRequired(false)
        )
    );
  }
}