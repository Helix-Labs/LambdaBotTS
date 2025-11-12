import { Command } from '@sapphire/framework';
import { ImageCommand } from './image-command';
import { Images } from '../../constants/images';

export class CamelCommand extends ImageCommand {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'camel',
      description: 'Gives random image of camels',
    });
  }

  protected getImageType(): Images {
    return Images.CAMEL;
  }
}