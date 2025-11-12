import { Command } from '@sapphire/framework';
import { Message, EmbedBuilder } from 'discord.js';
import { GamesManager } from '../../utils/games-manager';

export class CountCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'count',
      description: 'Starts a counting game where users take turns counting up',
      cooldownDelay: 30000, // 30 seconds
    });
  }

  public async messageRun(message: Message) {
    const channelId = message.channelId;

    // Check if there's already an active game in this channel
    if (GamesManager.hasCountGame(channelId)) {
      return message.reply('A counting game is already active in this channel!');
    }

    // Start a new game
    this.startGame(channelId, message);
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const channelId = interaction.channelId!;

    // Check if there's already an active game in this channel
    if (GamesManager.hasCountGame(channelId)) {
      return interaction.reply('A counting game is already active in this channel!');
    }

    await interaction.deferReply();

    // Start a new game
    this.startGame(channelId, interaction);
  }

  private startGame(channelId: string, context: Message | Command.ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle('🔢 Counting Game Started!')
      .setDescription('The next number is: **1**')
      .setColor('Green')
      .addFields(
        { name: 'Rules', value: '• Take turns counting up from 1\n• Each user can only count once per turn\n• You have 15 seconds to respond\n• Wrong number or timeout = game over!' }
      )
      .setTimestamp();

    if (context instanceof Message) {
      context.reply({ embeds: [embed] });
    } else {
      context.editReply({ embeds: [embed] });
    }

    // Set up game state
    const timeout = setTimeout(() => {
      this.endGame(channelId, 'Time\'s up! Game over.');
    }, 15000);

    GamesManager.setCountGame(channelId, {
      current: 1,
      lastUser: '',
      timeout
    });
  }

  private endGame(channelId: string, reason: string) {
    GamesManager.endCountGame(channelId);

    // Send message to channel
    const channel = this.container.client.channels.cache.get(channelId);
    if (channel && 'send' in channel) {
      (channel as any).send(`❌ ${reason}`);
    }
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
    );
  }
}