export class Utils {
  private static readonly startTime = Date.now();

  public static isNotUrl(url: string): boolean {
    try {
      new URL(url);
      return false;
    } catch {
      return true;
    }
  }

  public static getUptime(): string {
    const uptime = Date.now() - this.startTime;
    const seconds = Math.floor(uptime / 1000) % 60;
    const minutes = Math.floor((uptime / (1000 * 60)) % 60);
    const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    } else if (hours > 0) {
      return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    } else {
      return `${minutes} minutes, ${seconds} seconds`;
    }
  }

  public static formatUptime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  }
}