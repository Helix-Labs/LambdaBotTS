import { Command } from '@sapphire/framework';
import { ImageCommand } from './image-command';
import { Images } from '../../constants/images';

export class BirdCommand extends ImageCommand {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'bird',
      description: 'Gives random image of birds',
    });
  }

  protected getImageType(): Images {
    return Images.BIRD;
  }
}