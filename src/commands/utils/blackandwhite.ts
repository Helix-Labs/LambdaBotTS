import { Command } from '@sapphire/framework';
import { ImageUtilCommand } from './image-util-command';

export class BlackAndWhiteCommand extends ImageUtilCommand {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'blackandwhite',
      aliases: ['bw', 'grayscale'],
      description: 'Converts the supplied Image to Black and White',
      cooldownDelay: 30000, // 30 seconds
    });
  }

  protected getUtilUrl(): string {
    return 'b&w';
  }

  protected getDoneMessage(): string {
    return 'Black and White';
  }
}