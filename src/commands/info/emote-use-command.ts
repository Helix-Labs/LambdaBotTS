import { Command } from '@sapphire/framework';
import { Message, GuildEmoji } from 'discord.js';

export class EmoteUseCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'emote',
      aliases: ['emoteuse'],
      description: 'Use a server emoji by name',
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1);

    if (args.length === 0) {
      return message.reply('Missing arguments. Please provide an emoji name.');
    }

    const emoteName = args[0];
    const emote = this.searchEmote(emoteName);

    if (!emote) {
      return message.reply('No emote found with that name.');
    }

    return message.reply(emote.toString());
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const emoteName = interaction.options.getString('name', true);
    const emote = this.searchEmote(emoteName);

    if (!emote) {
      return interaction.reply('No emote found with that name.');
    }

    return interaction.reply(emote.toString());
  }

  private searchEmote(name: string): GuildEmoji | null {
    // Search through all guilds the bot is in
    for (const guild of this.container.client.guilds.cache.values()) {
      const emote = guild.emojis.cache.find(emoji => emoji.name?.toLowerCase() === name.toLowerCase());
      if (emote) {
        return emote;
      }
    }
    return null;
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('The name of the emoji to use')
            .setRequired(true)
        )
    );
  }
}