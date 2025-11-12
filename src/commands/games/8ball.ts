import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

const responses = [
  "It is certain",
  "It is decidedly so",
  "Without a doubt",
  "Yes - definitely",
  "You may rely on it",
  "As I see it, yes",
  "Most Likely",
  "Outlook good",
  "Yes",
  "Signs point to yes",
  "Reply hazy, try again",
  "Ask again later",
  "Better not tell you now",
  "Cannot predict now",
  "Concentrate and ask again",
  "Don't count on it",
  "My reply is no",
  "Outlook not so good",
  "No",
  "Very doubtful"
];

export class EightBallCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: '8ball',
      aliases: ['eightball'],
      description: 'Ask the magic 8-ball a question',
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1);
    if (args.length === 0) {
      return message.reply('Missing arguments. Ask a question!');
    }
    const question = args.join(' ');
    const answer = responses[Math.floor(Math.random() * responses.length)];
    return message.reply(`Question: ${question}\nAnswer: ${answer}`);
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const question = interaction.options.getString('question', true);
    const answer = responses[Math.floor(Math.random() * responses.length)];
    return interaction.reply(`Question: ${question}\nAnswer: ${answer}`);
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('8ball')
        .setDescription('Ask the magic 8-ball a question')
        .addStringOption(option =>
          option.setName('question')
            .setDescription('Your question')
            .setRequired(true)
        )
    );
  }
}