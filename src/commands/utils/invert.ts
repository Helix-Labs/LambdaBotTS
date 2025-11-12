import { Command } from '@sapphire/framework';
import { ImageUtilCommand } from './image-util-command';

export class InvertCommand extends ImageUtilCommand {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'invert',
      description: 'Inverts the colors of the supplied Image',
      cooldownDelay: 30000, // 30 seconds
    });
  }

  protected getUtilUrl(): string {
    return 'invert';
  }

  protected getDoneMessage(): string {
    return 'Inverted';
  }
}