import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

const emojiMap: { [key: string]: string } = {
  'a': '🇦', 'b': '🇧', 'c': '🇨', 'd': '🇩', 'e': '🇪', 'f': '🇫', 'g': '🇬', 'h': '🇭', 'i': '🇮', 'j': '🇯', 'k': '🇰', 'l': '🇱', 'm': '🇲', 'n': '🇳', 'o': '🇴', 'p': '🇵', 'q': '🇶', 'r': '🇷', 's': '🇸', 't': '🇹', 'u': '🇺', 'v': '🇻', 'w': '🇼', 'x': '🇽', 'y': '🇾', 'z': '🇿',
  '0': '0️⃣', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
  '!': '❗', '?': '❓', ' ': '   '
};

function emojify(text: string): string {
  return text.toLowerCase().split('').map(char => emojiMap[char] || char).join(' ');
}

export class EmojifyCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'emojify',
      description: 'Convert text to emojis',
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1);
    if (args.length === 0) {
      return message.reply('Missing arguments');
    }
    const text = args.join(' ');
    if (text.length > 200) {
      return message.reply('Text exceeds 200 characters');
    }
    const emojified = emojify(text);
    return message.reply(emojified);
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const text = interaction.options.getString('text', true);
    if (text.length > 200) {
      return interaction.reply('Text exceeds 200 characters');
    }
    const emojified = emojify(text);
    return interaction.reply(emojified);
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('emojify')
        .setDescription('Convert text to emojis')
        .addStringOption(option =>
          option.setName('text')
            .setDescription('Text to emojify')
            .setRequired(true)
        )
    );
  }
}