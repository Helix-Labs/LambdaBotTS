import { Command } from '@sapphire/framework';
import { ImageCommand } from './image-command';
import { Images } from './images';

export class DogCommand extends ImageCommand {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'dog',
      description: 'Gives random image of dogs',
    });
  }

  protected getImageType(): Images {
    return Images.DOG;
  }
}