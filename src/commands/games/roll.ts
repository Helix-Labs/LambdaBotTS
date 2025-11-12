import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

export class RollCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'roll',
      description: 'Roll a die',
    });
  }

  public async messageRun(message: Message) {
    const rollMessage = await message.reply('Rolling...');
    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      rollMessage.edit(`${result}`);
    }, 500);
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const result = Math.floor(Math.random() * 6) + 1;
    return interaction.reply(`🎲 ${result}`);
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('roll')
        .setDescription('Roll a die')
    );
  }
}