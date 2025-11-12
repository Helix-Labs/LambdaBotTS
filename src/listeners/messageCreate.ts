import { Listener } from '@sapphire/framework';
import { Message } from 'discord.js';

export class MessageCreateListener extends Listener<'messageCreate'> {
  public run(message: Message) {
    if (message.author.bot || message.webhookId) return;

    // Check if message is a mention of the bot
    if (message.content === message.guild?.members.me?.toString()) {
      message.reply('My prefix is `!`. To get started, send `!help`.').catch(() => {});
    }
  }
}