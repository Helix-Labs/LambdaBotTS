import { Command } from '@sapphire/framework';
import { ImageCommand } from './image-command';
import { Images } from './images';

export class LlamaCommand extends ImageCommand {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'llama',
      description: 'Gives random image of llamas',
    });
  }

  protected getImageType(): Images {
    return Images.LLAMA;
  }
}