import { Listener } from '@sapphire/framework';
import { TextChannel } from 'discord.js';
import { Config } from '../config/Config';

export class ClientReadyListener extends Listener<'ready'> {
  private statusChannel: TextChannel | null = null;

  public async run() {
    this.container.logger.info('Bot is ready and connected to Discord!');

    // Try to get the status channel for logging
    if (Config.BOT_STATUS_CHANNEL_ID) {
      try {
        const channel = await this.container.client.channels.fetch(Config.BOT_STATUS_CHANNEL_ID);
        if (channel?.isTextBased()) {
          this.statusChannel = channel as TextChannel;
          await this.statusChannel.send('`Started`');
        }
      } catch (error) {
        this.container.logger.warn('Could not find or access bot status channel:', error);
      }
    }
  }
}

export class ClientDisconnectListener extends Listener<'disconnect'> {
  public run() {
    this.container.logger.info('Bot disconnected from Discord');
  }
}

export class ClientReconnectingListener extends Listener<'reconnecting'> {
  public run() {
    this.container.logger.info('Bot is reconnecting to Discord');
  }
}

export class ClientResumedListener extends Listener<'resumed'> {
  public run() {
    this.container.logger.info('Bot connection resumed');
  }
}

export class ClientShardReadyListener extends Listener<'shardReady'> {
  public run(shardId: number) {
    this.container.logger.info(`Shard ${shardId} is ready`);
  }
}

export class ClientShardDisconnectListener extends Listener<'shardDisconnect'> {
  public run(event: any, shardId: number) {
    this.container.logger.warn(`Shard ${shardId} disconnected:`, event);
  }
}

export class ClientShardReconnectingListener extends Listener<'shardReconnecting'> {
  public run(shardId: number) {
    this.container.logger.info(`Shard ${shardId} is reconnecting`);
  }
}