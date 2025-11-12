import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

export class DistractorCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'distract',
      description: 'Distracts users',
    });
  }

  public async messageRun(message: Message) {
    await message.delete().catch(() => {});
    const emote = message.guild?.emojis.cache.get('749479039915261972')?.toString() || '😵';
    return (message.channel as any).send(emote);
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const emote = interaction.guild?.emojis.cache.get('749479039915261972')?.toString() || '😵';
    return interaction.reply(emote);
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('distract')
        .setDescription('Distracts users')
    );
  }
}