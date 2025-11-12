import { Command } from '@sapphire/framework';
import { ImageCommand } from './image-command';
import { Images } from '../../constants/images';

export class SealCommand extends ImageCommand {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'seal',
      description: 'Gives random image of seals',
    });
  }

  protected getImageType(): Images {
    return Images.SEAL;
  }
}