import { Command } from '@sapphire/framework';
import { ImageUtilCommand } from './image-util-command';

export class DarkenCommand extends ImageUtilCommand {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'darken',
      description: 'Darkens the supplied Image',
      cooldownDelay: 30000, // 30 seconds
    });
  }

  protected getUtilUrl(): string {
    return 'darken';
  }

  protected getDoneMessage(): string {
    return 'Darkened';
  }
}