import { Command } from '@sapphire/framework';
import { ImageCommand } from './image-command';
import { Images } from './images';

export class LizardCommand extends ImageCommand {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'lizard',
      description: 'Gives random image of lizards',
    });
  }

  protected getImageType(): Images {
    return Images.LIZARD;
  }
}