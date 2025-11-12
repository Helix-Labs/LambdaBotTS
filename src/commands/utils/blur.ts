import { Command } from '@sapphire/framework';
import { ImageUtilCommand } from './image-util-command';

export class BlurCommand extends ImageUtilCommand {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'blur',
      description: 'Blurs the supplied Image',
      cooldownDelay: 30000, // 30 seconds
    });
  }

  protected getUtilUrl(): string {
    return 'blur';
  }

  protected getDoneMessage(): string {
    return 'Blurred';
  }
}