import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';
import { Config } from '../../config/Config';

export class CloseCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'close',
      description: 'Shutdown the bot',
    });
  }

  public async messageRun(message: Message) {
    if (!Config.isOwner(message.author.id)) return;

    await message.reply('Shutting Down');
    this.container.logger.info('Shutting Down');
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.container.client.destroy();
    process.exit(0);
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    if (!Config.isOwner(interaction.user.id)) return;

    await interaction.reply('Shutting Down');
    this.container.logger.info('Shutting Down');
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.container.client.destroy();
    process.exit(0);
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('close').setDescription('Shutdown the bot')
    );
  }
}