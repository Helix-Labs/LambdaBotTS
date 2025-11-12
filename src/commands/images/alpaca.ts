import { Command } from '@sapphire/framework';
import { ImageCommand } from './image-command';
import { Images } from '../../constants/images';

export class AlpacaCommand extends ImageCommand {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'alpaca',
      description: 'Gives random image of alpacas',
    });
  }

  protected getImageType(): Images {
    return Images.ALPACA;
  }
}