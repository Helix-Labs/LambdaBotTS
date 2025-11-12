import { Command } from '@sapphire/framework';
import { EmbedBuilder, Message, Guild, GuildVerificationLevel } from 'discord.js';

export class ServerInfoCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'serverinfo',
      aliases: ['si', 'server'],
      description: 'Shows information about the server',
    });
  }

  public async messageRun(message: Message) {
    const guild = message.guild!;
    const embed = this.buildEmbed(guild);
    return message.reply({ embeds: [embed] });
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const guild = interaction.guild!;
    const embed = this.buildEmbed(guild);
    return interaction.reply({ embeds: [embed] });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
    );
  }

  private buildEmbed(guild: Guild): EmbedBuilder {
    const owner = guild.ownerId;
    const createdAt = guild.createdAt.toUTCString();
    const verificationLevel = this.convertVerificationLevel(guild.verificationLevel);

    // Count online members (approximate)
    const totalMembers = guild.memberCount;
    const onlineMembers = guild.members.cache.filter(member =>
      member.presence?.status === 'online' ||
      member.presence?.status === 'dnd' ||
      member.presence?.status === 'idle'
    ).size;
    const offlineMembers = totalMembers - onlineMembers;

    const generalInfo = `> **Owner** : <@${owner}>\n> **Locale** : ${guild.preferredLocale}\n> **Creation Date** : ${createdAt}\n> **Verification Level** : ${verificationLevel}`;

    const numberInfo = `> **Total Roles** : ${guild.roles.cache.size}\n> **Total Emotes** : ${guild.emojis.cache.size}\n> **Total Members** : ${totalMembers}\n> **Online Members** : ${onlineMembers}\n> **Offline Members** : ${offlineMembers}\n> **Categories** : ${guild.channels.cache.filter(ch => ch.type === 4).size}\n> **Text Channels** : ${guild.channels.cache.filter(ch => ch.type === 0).size}\n> **Voice Channels** : ${guild.channels.cache.filter(ch => ch.type === 2).size}`;

    return new EmbedBuilder()
      .setTitle(`Server info for ${guild.name}`)
      .setThumbnail(guild.iconURL() || null)
      .addFields(
        { name: 'General Info', value: generalInfo, inline: false },
        { name: 'Counts Info', value: numberInfo, inline: false }
      )
      .setTimestamp();
  }

  private convertVerificationLevel(level: GuildVerificationLevel): string {
    const names = level.toString().toLowerCase().split('_');
    return names.map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
  }
}