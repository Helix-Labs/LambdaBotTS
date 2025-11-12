import { Command } from '@sapphire/framework';
import { Message, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { DatabaseManager } from '../../database/DatabaseManager';

export abstract class SettingCommand extends Command {
  protected abstract updateSetting(guildId: string, newValue: string): Promise<void>;
  protected abstract getDefaultValue(): string;
  protected abstract getSettingName(): string;

  public async messageRun(message: Message) {
    // Check permissions
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply("You don't have MANAGE SERVER Permission");
    }

    const args = message.content.split(' ').slice(1);
    const newValue = args.join(' ').trim();

    if (!newValue) {
      // Reset to default
      await this.updateSetting(message.guildId!, this.getDefaultValue());
      return message.reply(`\`${this.getSettingName()}\` changed to default: \`${this.getDefaultValue()}\``);
    }

    try {
      await this.updateSetting(message.guildId!, newValue);
      return message.reply(`\`${this.getSettingName()}\` updated successfully.`);
    } catch (error) {
      return message.reply('Something went wrong, please try again later.');
    }
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    // Check permissions
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.reply("You don't have MANAGE SERVER Permission");
    }

    const newValue = interaction.options.getString('value', true);

    await interaction.deferReply();

    try {
      await this.updateSetting(interaction.guildId!, newValue);
      return interaction.editReply(`\`${this.getSettingName()}\` updated successfully.`);
    } catch (error) {
      return interaction.editReply('Something went wrong, please try again later.');
    }
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option
            .setName('value')
            .setDescription(`The new ${this.getSettingName().toLowerCase()} value`)
            .setRequired(true)
        )
    );
  }
}