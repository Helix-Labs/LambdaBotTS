import { Command } from '@sapphire/framework';
import { Message, EmbedBuilder } from 'discord.js';
import { GamesManager } from '../../utils/games-manager';

interface TriviaQuestion {
  question: string;
  answers: string[];
  correct: number;
}

export class TriviaCommand extends Command {
  private questions: TriviaQuestion[] = [
    {
      question: "What is the capital of France?",
      answers: ["London", "Berlin", "Paris", "Madrid"],
      correct: 2
    },
    {
      question: "Which programming language is known as the 'mother of all languages'?",
      answers: ["Java", "C", "Python", "JavaScript"],
      correct: 1
    },
    {
      question: "What does 'www' stand for in a website address?",
      answers: ["World Wide Web", "World Web Way", "Wide World Web", "Web World Wide"],
      correct: 0
    },
    {
      question: "Which planet is known as the Red Planet?",
      answers: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1
    },
    {
      question: "What is 2 + 2 × 3?",
      answers: ["12", "8", "10", "6"],
      correct: 1
    }
  ];

  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'trivia',
      description: 'Starts a trivia game with random questions',
      cooldownDelay: 10000, // 10 seconds
    });
  }

  public async messageRun(message: Message) {
    const channelId = message.channelId;

    // Check if there's already an active game in this channel
    if (GamesManager.hasTriviaGame(channelId)) {
      return message.reply('A trivia game is already active in this channel!');
    }

    // Start a new game
    this.startGame(channelId, message);
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const channelId = interaction.channelId!;

    // Check if there's already an active game in this channel
    if (GamesManager.hasTriviaGame(channelId)) {
      return interaction.reply('A trivia game is already active in this channel!');
    }

    await interaction.deferReply();

    // Start a new game
    this.startGame(channelId, interaction);
  }

  private startGame(channelId: string, context: Message | Command.ChatInputCommandInteraction) {
    // Get random question
    const question = this.questions[Math.floor(Math.random() * this.questions.length)];

    const embed = new EmbedBuilder()
      .setTitle('🧠 Trivia Time!')
      .setDescription(`**${question.question}**\n\n${question.answers.map((answer, index) => `${index + 1}. ${answer}`).join('\n')}`)
      .setColor('Blue')
      .setFooter({ text: 'Reply with the number of your answer! You have 30 seconds.' })
      .setTimestamp();

    if (context instanceof Message) {
      context.reply({ embeds: [embed] });
    } else {
      context.editReply({ embeds: [embed] });
    }

    // Set up game state
    const timeout = setTimeout(() => {
      this.endGame(channelId, `Time's up! The correct answer was: **${question.answers[question.correct]}**`);
    }, 30000);

    GamesManager.setTriviaGame(channelId, {
      question,
      timeout
    });
  }

  private endGame(channelId: string, reason: string) {
    GamesManager.endTriviaGame(channelId);

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