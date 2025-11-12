import { Command } from '@sapphire/framework';
import { SettingCommand } from './setting-command';
import { DatabaseManager } from '../../database/DatabaseManager';
import { Message, ChatInputCommandInteraction } from 'discord.js';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

export class SetWelcomeBackgroundCommand extends SettingCommand {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'setwelcomebackground',
      aliases: ['welcomebackground'],
      description: 'Set the welcome background image for this server',
    });
  }

  protected async updateSetting(guildId: string, newValue: string): Promise<void> {
    await DatabaseManager.getInstance().updateGuildSetting(guildId, 'welcomeBackground', newValue);
  }

  protected getDefaultValue(): string {
    return 'default';
  }

  protected getSettingName(): string {
    return 'Welcome Background';
  }

  public async messageRun(message: Message) {
    // Check permissions
    if (!message.member?.permissions.has('ManageGuild')) {
      return message.reply("You don't have MANAGE SERVER Permission");
    }

    const attachments = message.attachments;

    if (attachments.size === 0) {
      return message.reply('Please upload the background image with the command.');
    }

    const attachment = attachments.first()!;

    // Validate it's an image
    if (!attachment.contentType?.startsWith('image/')) {
      return message.reply('Please upload a valid image file.');
    }

    try {
      // Download and save the image
      const fileName = `${message.guildId}.png`;
      const filePath = join(process.cwd(), 'database', 'background', fileName);

      // Ensure directory exists
      const fs = await import('fs');
      const path = await import('path');
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

      const response = await fetch(attachment.url);
      const buffer = await response.arrayBuffer();
      await fs.promises.writeFile(filePath, Buffer.from(buffer));

      // Update setting
      await this.updateSetting(message.guildId!, fileName);

      return message.reply({
        content: 'New Welcome Image Background set!',
        files: [filePath]
      });
    } catch (error) {
      console.error('Error saving welcome background:', error);
      return message.reply('Something went wrong while saving the background image.');
    }
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    // Check permissions
    if (!interaction.memberPermissions?.has('ManageGuild')) {
      return interaction.reply("You don't have MANAGE SERVER Permission");
    }

    const attachment = interaction.options.getAttachment('image', true);

    // Validate it's an image
    if (!attachment.contentType?.startsWith('image/')) {
      return interaction.reply('Please upload a valid image file.');
    }

    await interaction.deferReply();

    try {
      // Download and save the image
      const fileName = `${interaction.guildId}.png`;
      const filePath = join(process.cwd(), 'database', 'background', fileName);

      // Ensure directory exists
      const fs = await import('fs');
      const path = await import('path');
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

      const response = await fetch(attachment.url);
      const buffer = await response.arrayBuffer();
      await fs.promises.writeFile(filePath, Buffer.from(buffer));

      // Update setting
      await this.updateSetting(interaction.guildId!, fileName);

      return interaction.editReply({
        content: 'New Welcome Image Background set!',
        files: [filePath]
      });
    } catch (error) {
      console.error('Error saving welcome background:', error);
      return interaction.editReply('Something went wrong while saving the background image.');
    }
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addAttachmentOption((option) =>
          option
            .setName('image')
            .setDescription('The background image to upload')
            .setRequired(true)
        )
    );
  }
}