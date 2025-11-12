import { Command } from '@sapphire/framework';
import { ImageCommand } from './image-command';
import { Images } from './images';

export class PandaCommand extends ImageCommand {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'panda',
      description: 'Gives random image of pandas',
    });
  }

  protected getImageType(): Images {
    return Images.PANDA;
  }
}