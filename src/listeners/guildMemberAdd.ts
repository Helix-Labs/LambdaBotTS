import { Listener } from '@sapphire/framework';
import { GuildMember, TextChannel, AttachmentBuilder } from 'discord.js';
import { DatabaseManager } from '../database/DatabaseManager';
import { ImageUtils } from '../utils/ImageUtils';
import { createCanvas } from 'canvas';
import { join } from 'path';

export class GuildMemberAddListener extends Listener<'guildMemberAdd'> {
  public async run(member: GuildMember) {
    try {
      const welcomeSettings = await DatabaseManager.getInstance().getWelcomeSettings(member.guild.id);

      // Check if welcome is enabled (channelId is not empty and not "-1")
      if (!welcomeSettings.channelId || welcomeSettings.channelId === '-1') {
        return;
      }

      this.container.logger.info(`${member.displayName} joined ${member.guild.name}`);

      await this.sendWelcomeMessage(member, welcomeSettings);
    } catch (error) {
      this.container.logger.error('Error in welcome system:', error);
    }
  }

  private async sendWelcomeMessage(member: GuildMember, welcomeSettings: { message: string; channelId: string; background: string }) {
    const guild = member.guild;
    const welcomeChannel = guild.channels.cache.get(welcomeSettings.channelId) as TextChannel;

    if (!welcomeChannel) {
      this.container.logger.warn(`Welcome channel ${welcomeSettings.channelId} not found in guild ${guild.name}`);
      return;
    }

    // Generate welcome message with placeholders
    const welcomeMessage = welcomeSettings.message
      .replace(/\{user\}|\{user\.name\}/g, member.displayName)
      .replace(/\{guild\}/g, guild.name)
      .replace(/\{user\.mention\}/g, member.toString());

    try {
      // Generate welcome image
      const welcomeImageBuffer = await this.generateWelcomeImage(member, guild, welcomeSettings.background);

      // Create attachment
      const attachment = new AttachmentBuilder(welcomeImageBuffer, { name: 'welcome.png' });

      // Send welcome message with image
      await welcomeChannel.send({
        content: welcomeMessage,
        files: [attachment]
      });
    } catch (error) {
      this.container.logger.error('Error generating welcome image:', error);
      // Send message without image as fallback
      await welcomeChannel.send({ content: welcomeMessage });
    }
  }

  private async generateWelcomeImage(member: GuildMember, guild: any, backgroundFile: string): Promise<Buffer> {
    try {
      // Load background image
      const backgroundPath = join(process.cwd(), 'database', 'background', `${backgroundFile}.png`);
      const backgroundImage = await ImageUtils.loadImageFromFile(backgroundPath);

      const backgroundWidth = backgroundImage.width;
      const backgroundHeight = backgroundImage.height;

      // Create canvas
      const canvas = createCanvas(backgroundWidth, backgroundHeight);
      const ctx = canvas.getContext('2d');

      // Draw background
      ctx.drawImage(backgroundImage, 0, 0);

      // Load and resize avatar
      const avatarUrl = member.user.displayAvatarURL({ extension: 'png', size: 512 });
      const avatarImage = await ImageUtils.loadImageFromUrl(avatarUrl);
      const avatarSize = Math.floor(backgroundWidth / 3);
      const resizedAvatar = ImageUtils.resize(createCanvas(avatarSize, avatarSize), avatarSize, avatarSize);

      // Draw avatar on resized canvas first
      const avatarCtx = resizedAvatar.getContext('2d');
      avatarCtx.drawImage(avatarImage, 0, 0, avatarSize, avatarSize);

      // Make avatar rounded
      const roundedAvatar = ImageUtils.makeRoundedCorner(resizedAvatar, avatarSize);

      // Position avatar
      const avatarX = Math.floor(backgroundWidth / 2 - avatarSize / 2);
      const avatarY = Math.floor((backgroundHeight - 50) / 2 - avatarSize / 2);

      // Draw rounded avatar
      ctx.drawImage(roundedAvatar as any, avatarX, avatarY);

      // Draw text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';

      // Set font
      const fontSize = Math.floor(backgroundWidth / 30);
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;

      // Draw welcome text
      const welcomeText = `Welcome ${member.displayName} to ${guild.name}!`;
      const textY = backgroundHeight - (backgroundHeight / 5);
      ctx.fillText(welcomeText, backgroundWidth / 2, textY);

      // Draw member count
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      const memberCount = guild.memberCount;
      const memberText = `Member #${memberCount}`;
      const memberTextY = backgroundHeight - (backgroundHeight / 10);
      ctx.fillText(memberText, backgroundWidth / 2, memberTextY);

      // Apply rounded corners to entire image
      const finalCanvas = ImageUtils.makeRoundedCorner(canvas, 100);

      return ImageUtils.getBytes(finalCanvas);
    } catch (error) {
      this.container.logger.error('Error generating welcome image:', error);
      throw error;
    }
  }
}