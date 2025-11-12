import { Command } from '@sapphire/framework';
import { ImageCommand } from './image-command';
import { Images } from '../../constants/images';

export class FoxCommand extends ImageCommand {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'fox',
      description: 'Gives random image of foxes',
    });
  }

  protected getImageType(): Images {
    return Images.FOX;
  }
}