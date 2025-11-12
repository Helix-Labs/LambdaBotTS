import { Command } from '@sapphire/framework';
import { ImageUtilCommand } from './image-util-command';

export class PixelateCommand extends ImageUtilCommand {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'pixelate',
      description: 'Pixelates the supplied Image',
      cooldownDelay: 30000, // 30 seconds
    });
  }

  protected getUtilUrl(): string {
    return 'pixelate';
  }

  protected getDoneMessage(): string {
    return 'Pixelated';
  }
}