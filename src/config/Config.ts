import 'dotenv/config';

/**
 * Configuration utility for environment variables
 * Provides type-safe access to environment variables with defaults
 */
export class Config {
  /**
   * Get an environment variable value
   */
  public static get(key: string): string | undefined {
    return process.env[key.toUpperCase()];
  }

  /**
   * Get an environment variable with a fallback value
   */
  public static getOrDefault(key: string, defaultValue: string): string {
    return this.get(key) || defaultValue;
  }

  /**
   * Get an environment variable as a number
   */
  public static getNumber(key: string, defaultValue?: number): number | undefined {
    const value = this.get(key);
    if (!value) return defaultValue;

    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Get an array of values from a comma-separated environment variable
   */
  public static getArray(key: string): string[] {
    const value = this.get(key);
    if (!value) return [];

    return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
  }

  /**
   * Get an array of numbers from a comma-separated environment variable
   */
  public static getNumberArray(key: string): number[] {
    return this.getArray(key)
      .map(item => parseInt(item, 10))
      .filter(num => !isNaN(num));
  }

  // Discord Configuration
  public static get DISCORD_TOKEN(): string {
    const token = this.get('DISCORD_TOKEN');
    if (!token) {
      throw new Error('DISCORD_TOKEN environment variable is required');
    }
    return token;
  }

  public static get BETA_TOKEN(): string | undefined {
    return this.get('BETA_TOKEN');
  }

  // Owner Configuration
  public static get OWNER_ID(): string {
    return this.getOrDefault('OWNER_ID', '');
  }

  public static get OWNER_IDS(): string[] {
    const ownerIds = this.getArray('OWNER_IDS');
    if (ownerIds.length === 0 && this.OWNER_ID) {
      return [this.OWNER_ID];
    }
    return ownerIds;
  }

  // Database Configuration
  public static get MONGODB_URI(): string {
    return this.getOrDefault('MONGODB_URI', 'mongodb://localhost:27017/lambdabot');
  }

  // Default Bot Settings
  public static get DEFAULT_PREFIX(): string {
    return this.getOrDefault('DEFAULT_PREFIX', '!');
  }

  public static get DEFAULT_WELCOME_MESSAGE(): string {
    return this.getOrDefault('DEFAULT_WELCOME_MESSAGE', 'Welcome {user} to {guild}!');
  }

  // Bot Listing Services
  public static get TOPGG_TOKEN(): string | undefined {
    return this.get('TOPGG_TOKEN');
  }

  public static get DISCORD_BOATS_TOKEN(): string | undefined {
    return this.get('DISCORD_BOATS_TOKEN');
  }

  public static get INFINITY_BOT_LIST_TOKEN(): string | undefined {
    return this.get('INFINITY_BOT_LIST_TOKEN');
  }

  // Bot Status Channel
  public static get BOT_STATUS_CHANNEL_ID(): string | undefined {
    return this.get('BOT_STATUS_CHANNEL_ID');
  }

  /**
   * Check if a user ID is a bot owner
   */
  public static isOwner(userId: string): boolean {
    return this.OWNER_IDS.includes(userId);
  }

  /**
   * Validate required environment variables
   */
  public static validate(): void {
    const required = ['DISCORD_TOKEN'];

    for (const key of required) {
      if (!this.get(key)) {
        throw new Error(`Required environment variable ${key} is not set`);
      }
    }

    // Warn about missing optional but recommended variables
    const recommended = ['MONGODB_URI', 'OWNER_ID'];
    for (const key of recommended) {
      if (!this.get(key)) {
        console.warn(`Recommended environment variable ${key} is not set`);
      }
    }
  }
}