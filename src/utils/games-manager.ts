interface CountGame {
  current: number;
  lastUser: string;
  timeout: NodeJS.Timeout;
}

interface TriviaGame {
  question: {
    question: string;
    answers: string[];
    correct: number;
  };
  timeout: NodeJS.Timeout;
}

export class GamesManager {
  private static countGames: Map<string, CountGame> = new Map();
  private static triviaGames: Map<string, TriviaGame> = new Map();

  public static hasCountGame(channelId: string): boolean {
    return this.countGames.has(channelId);
  }

  public static hasTriviaGame(channelId: string): boolean {
    return this.triviaGames.has(channelId);
  }

  public static setCountGame(channelId: string, game: CountGame): void {
    this.countGames.set(channelId, game);
  }

  public static setTriviaGame(channelId: string, game: TriviaGame): void {
    this.triviaGames.set(channelId, game);
  }

  public static getCountGame(channelId: string): CountGame | undefined {
    return this.countGames.get(channelId);
  }

  public static getTriviaGame(channelId: string): TriviaGame | undefined {
    return this.triviaGames.get(channelId);
  }

  public static endCountGame(channelId: string): void {
    const game = this.countGames.get(channelId);
    if (game) {
      clearTimeout(game.timeout);
      this.countGames.delete(channelId);
    }
  }

  public static endTriviaGame(channelId: string): void {
    const game = this.triviaGames.get(channelId);
    if (game) {
      clearTimeout(game.timeout);
      this.triviaGames.delete(channelId);
    }
  }

  public static updateCountGame(channelId: string, game: CountGame): void {
    this.countGames.set(channelId, game);
  }
}