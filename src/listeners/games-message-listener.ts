import { Listener } from '@sapphire/framework';
import { Message } from 'discord.js';
import { GamesManager } from '../utils/games-manager';

export class GamesMessageListener extends Listener {
  public constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, {
      ...options,
      event: 'messageCreate'
    });
  }

  public run(message: Message) {
    // Ignore bot messages
    if (message.author.bot) return;

    const channelId = message.channelId;
    const userId = message.author.id;
    const content = message.content.trim();

    // Handle counting game
    if (GamesManager.hasCountGame(channelId)) {
      this.handleCountGame(message, channelId, userId, content);
      return;
    }

    // Handle trivia game
    if (GamesManager.hasTriviaGame(channelId)) {
      this.handleTriviaGame(message, channelId, content);
      return;
    }
  }

  private handleCountGame(message: Message, channelId: string, userId: string, content: string) {
    const game = GamesManager.getCountGame(channelId);
    if (!game) return;

    // Check if it's the same user
    if (game.lastUser === userId) {
      message.reply('❌ You can\'t count twice in a row!');
      this.endCountGame(channelId, 'Game over - same user counted twice!');
      return;
    }

    // Check if it's a valid number
    const num = parseInt(content);
    if (isNaN(num)) {
      message.reply('❌ That\'s not a valid number!');
      this.endCountGame(channelId, 'Game over - invalid number!');
      return;
    }

    // Check if it's the correct next number
    if (num !== game.current) {
      message.reply(`❌ Wrong number! The next number was ${game.current}.`);
      this.endCountGame(channelId, `Game over! ${message.author.username} got it wrong.`);
      return;
    }

    // Correct answer!
    game.current++;
    game.lastUser = userId;

    // Clear existing timeout and set new one
    clearTimeout(game.timeout);
    game.timeout = setTimeout(() => {
      this.endCountGame(channelId, 'Time\'s up! Game over.');
    }, 15000);

    // Update game state
    GamesManager.updateCountGame(channelId, game);

    message.react('✅');
  }

  private handleTriviaGame(message: Message, channelId: string, content: string) {
    const game = GamesManager.getTriviaGame(channelId);
    if (!game) return;

    // Check if it's a valid answer number
    const answerIndex = parseInt(content) - 1; // Convert to 0-based index
    if (isNaN(answerIndex) || answerIndex < 0 || answerIndex >= game.question.answers.length) {
      return; // Invalid answer, ignore
    }

    // Check if correct
    if (answerIndex === game.question.correct) {
      message.reply(`🎉 Correct! ${message.author.username} got it right!`);
      this.endTriviaGame(channelId);
    } else {
      message.reply(`❌ Wrong! The correct answer was: **${game.question.answers[game.question.correct]}**`);
      this.endTriviaGame(channelId);
    }
  }

  private endCountGame(channelId: string, reason: string) {
    GamesManager.endCountGame(channelId);

    const channel = this.container.client.channels.cache.get(channelId);
    if (channel && 'send' in channel) {
      (channel as any).send(`❌ ${reason}`);
    }
  }

  private endTriviaGame(channelId: string) {
    GamesManager.endTriviaGame(channelId);
  }
}