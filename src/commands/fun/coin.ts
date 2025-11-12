import { Command } from '@sapphire/framework';
import { Message, EmbedBuilder } from 'discord.js';

export class CoinCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'coin',
      description: 'Flip a coin',
    });
  }

  public async messageRun(message: Message) {
    const isHeads = Math.random() < 0.5;
    const image = isHeads
      ? 'https://media.discordapp.net/attachments/741153014080864267/767282060997165056/heads.png'
      : 'https://media.discordapp.net/attachments/741153014080864267/767282063656222721/tails.png';
    const color = Math.floor(Math.random() * 0xFFFFFF);

    const embed = new EmbedBuilder()
      .setColor(color)
      .setImage(image);

    return message.reply({ embeds: [embed] });
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const isHeads = Math.random() < 0.5;
    const image = isHeads
      ? 'https://media.discordapp.net/attachments/741153014080864267/767282060997165056/heads.png'
      : 'https://media.discordapp.net/attachments/741153014080864267/767282063656222721/tails.png';
    const color = Math.floor(Math.random() * 0xFFFFFF);

    const embed = new EmbedBuilder()
      .setColor(color)
      .setImage(image);

    return interaction.reply({ embeds: [embed] });
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('coin')
        .setDescription('Flip a coin')
    );
  }
}