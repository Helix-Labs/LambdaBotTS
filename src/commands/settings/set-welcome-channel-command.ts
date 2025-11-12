import { Command } from '@sapphire/framework';
import { SettingCommand } from './setting-command';
import { DatabaseManager } from '../../database/DatabaseManager';
import { Message, ChatInputCommandInteraction, ChannelType } from 'discord.js';

export class SetWelcomeChannelCommand extends SettingCommand {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'setwelcomechannel',
      description: 'Set the welcome channel for this server',
    });
  }

  protected async updateSetting(guildId: string, newValue: string): Promise<void> {
    await DatabaseManager.getInstance().updateGuildSetting(guildId, 'welcomeChannelId', newValue);
  }

  protected getDefaultValue(): string {
    return '';
  }

  protected getSettingName(): string {
    return 'Welcome Channel';
  }

  public async messageRun(message: Message) {
    // Check permissions
    if (!message.member?.permissions.has('ManageGuild')) {
      return message.reply("You don't have MANAGE SERVER Permission");
    }

    const args = message.content.split(' ').slice(1);
    const channelMention = args.join(' ').trim();

    if (!channelMention) {
      // Reset to default
      await this.updateSetting(message.guildId!, this.getDefaultValue());
      return message.reply(`\`${this.getSettingName()}\` changed to default: \`${this.getDefaultValue()}\``);
    }

    // Parse channel mention or ID
    let channelId: string;

    const mentionedChannels = message.mentions.channels;
    if (mentionedChannels.size > 0) {
      channelId = mentionedChannels.first()!.id;
    } else {
      // Try to parse as channel ID
      const channel = message.guild?.channels.cache.get(channelMention);
      if (!channel || channel.type !== ChannelType.GuildText) {
        return message.reply(`No text channel exists with this ID or mention: \`${channelMention}\``);
      }
      channelId = channel.id;
    }

    try {
      await this.updateSetting(message.guildId!, channelId);
      return message.reply(`New Welcome Channel set to: <#${channelId}>`);
    } catch (error) {
      return message.reply('Something went wrong, please try again later.');
    }
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    // Check permissions
    if (!interaction.memberPermissions?.has('ManageGuild')) {
      return interaction.reply("You don't have MANAGE SERVER Permission");
    }

    const channel = interaction.options.getChannel('channel', true);

    if (channel.type !== ChannelType.GuildText) {
      return interaction.reply('Please select a text channel.');
    }

    await interaction.deferReply();

    try {
      await this.updateSetting(interaction.guildId!, channel.id);
      return interaction.editReply(`New Welcome Channel set to: <#${channel.id}>`);
    } catch (error) {
      return interaction.editReply('Something went wrong, please try again later.');
    }
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('The channel to set as welcome channel')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    );
  }
}