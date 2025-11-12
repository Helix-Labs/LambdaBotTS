import { Command } from '@sapphire/framework';
import { ImageCommand } from './image-command';
import { Images } from '../../constants/images';

export class WolfCommand extends ImageCommand {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'wolf',
      description: 'Gives random image of wolves',
    });
  }

  protected getImageType(): Images {
    return Images.WOLF;
  }
}