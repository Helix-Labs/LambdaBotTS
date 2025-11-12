import { Command } from '@sapphire/framework';
import { ImageCommand } from './image-command';
import { Images } from './images';

export class DuckCommand extends ImageCommand {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'duck',
      description: 'Gives random image of ducks',
    });
  }

  protected getImageType(): Images {
    return Images.DUCK;
  }
}