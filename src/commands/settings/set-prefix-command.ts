import { Command } from '@sapphire/framework';
import { SettingCommand } from './setting-command';
import { DatabaseManager } from '../../database/DatabaseManager';

export class SetPrefixCommand extends SettingCommand {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'setprefix',
      description: 'Set the bot prefix for this server',
    });
  }

  protected async updateSetting(guildId: string, newValue: string): Promise<void> {
    await DatabaseManager.getInstance().updateGuildSetting(guildId, 'prefix', newValue);
  }

  protected getDefaultValue(): string {
    return '!';
  }

  protected getSettingName(): string {
    return 'Prefix';
  }
}