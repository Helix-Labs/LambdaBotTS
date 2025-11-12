import { Command } from '@sapphire/framework';
import { SettingCommand } from './setting-command';
import { DatabaseManager } from '../../database/DatabaseManager';

export class SetWelcomeMessageCommand extends SettingCommand {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'setwelcomemessage',
      aliases: ['welcomemessage'],
      description: 'Set the welcome message for this server',
    });
  }

  protected async updateSetting(guildId: string, newValue: string): Promise<void> {
    await DatabaseManager.getInstance().updateGuildSetting(guildId, 'welcomeMessage', newValue);
  }

  protected getDefaultValue(): string {
    return 'Welcome {user} to {guild}!';
  }

  protected getSettingName(): string {
    return 'Welcome Message';
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option
            .setName('message')
            .setDescription('The welcome message (use {user} for username, {user.mention} for mention, {guild} for server name)')
            .setRequired(true)
        )
    );
  }
}