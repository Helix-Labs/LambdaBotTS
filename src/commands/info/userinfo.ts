import { Command } from '@sapphire/framework';
import { EmbedBuilder, Message, User, GuildMember } from 'discord.js';

export class UserInfoCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'userinfo',
      aliases: ['whois', 'user', 'info', 'profile'],
      description: 'Displays information about a user',
      detailedDescription: 'Shows detailed information about a mentioned user or yourself if no user is specified.',
      cooldownDelay: 20000, // 20 seconds
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1);
    let user: User;
    let member: GuildMember | null = null;

    if (args.length === 0) {
      user = message.author;
      member = message.member;
    } else {
      const mentionedUser = message.mentions.users.first();
      if (mentionedUser) {
        user = mentionedUser;
        member = message.guild!.members.cache.get(user.id) || null;
      } else {
        return message.reply('Please mention a user or provide no arguments for yourself.');
      }
    }

    if (!member) {
      return message.reply('User not found in this guild.');
    }

    const embed = this.buildEmbed(user, member);
    return message.reply({ embeds: [embed] });
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const member = interaction.guild!.members.cache.get(user.id);

    if (!member) {
      return interaction.reply('User not found in this guild.');
    }

    const embed = this.buildEmbed(user, member);
    return interaction.reply({ embeds: [embed] });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('The user to get info about')
            .setRequired(false)
        )
    );
  }

  private buildEmbed(user: User, member: GuildMember): EmbedBuilder {
    const roles = member.roles.cache;
    const roleCount = roles.size;
    const highestRole = member.roles.highest?.toString() || 'No Role';

    const status = member.presence?.status || 'offline';
    const isStreaming = member.presence?.activities.some(activity => activity.type === 1) || false;

    let statusEmote = '⚫';
    if (isStreaming) statusEmote = '🔴';
    else if (status === 'online') statusEmote = '🟢';
    else if (status === 'idle') statusEmote = '🟡';
    else if (status === 'dnd') statusEmote = '🔴';

    const embed = new EmbedBuilder()
      .setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL(),
        url: user.displayAvatarURL()
      })
      .setTitle(`${statusEmote} ${member.displayName}`)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .setColor(member.displayColor)
      .addFields(
        { name: 'User Id + Mention', value: `${user.id} ${member.toString()}`, inline: true },
        { name: 'Account Created', value: user.createdAt.toUTCString(), inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: 'Guild Joined', value: member.joinedAt?.toUTCString() || 'Unknown', inline: true },
        { name: 'Bot Account', value: user.bot ? '✅' : '❌', inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: 'Role Count', value: roleCount.toString(), inline: true },
        { name: 'Highest Role', value: highestRole, inline: true },
        { name: '\u200B', value: '\u200B', inline: true }
      );

    return embed;
  }
}