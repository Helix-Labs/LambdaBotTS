import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

const choices = ['rock', 'paper', 'scissors'];
const shortChoices: { [key: string]: string } = { 'r': 'rock', 'p': 'paper', 's': 'scissors', 'scissor': 'scissors' };

function getWinner(user: string, bot: string): string {
  if (user === bot) return 'tie';
  if ((user === 'rock' && bot === 'scissors') ||
      (user === 'paper' && bot === 'rock') ||
      (user === 'scissors' && bot === 'paper')) {
    return 'user';
  }
  return 'bot';
}

export class RPSCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'rps',
      description: 'Play rock paper scissors',
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1);
    if (args.length === 0) {
      return message.reply('Missing arguments. Choose rock, paper, or scissors');
    }

    let userChoice = args[0].toLowerCase();
    userChoice = shortChoices[userChoice] || userChoice;

    if (!choices.includes(userChoice)) {
      return message.reply('Invalid choice. Try rock, paper, or scissors');
    }

    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    const initial = await message.reply(`You: ${userChoice}\nMe: ${botChoice}`);

    setTimeout(() => {
      const winner = getWinner(userChoice, botChoice);
      let result: string;
      if (winner === 'tie') {
        result = `You: ${userChoice}\nMe: ${botChoice}\nIt's a tie!!!`;
      } else if (winner === 'user') {
        result = `You: ${userChoice}\nMe: ${botChoice}\nYou win!! D:`;
      } else {
        result = `You: ${userChoice}\nMe: ${botChoice}\nI win!! :D`;
      }
      initial.edit(result);
    }, 1000);
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const userChoice = interaction.options.getString('choice', true);
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    const winner = getWinner(userChoice, botChoice);
    let result: string;
    if (winner === 'tie') {
      result = `You: ${userChoice}\nMe: ${botChoice}\nIt's a tie!!!`;
    } else if (winner === 'user') {
      result = `You: ${userChoice}\nMe: ${botChoice}\nYou win!! D:`;
    } else {
      result = `You: ${userChoice}\nMe: ${botChoice}\nI win!! :D`;
    }

    return interaction.reply(result);
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('rps')
        .setDescription('Play rock paper scissors')
        .addStringOption(option =>
          option.setName('choice')
            .setDescription('Your choice')
            .setRequired(true)
            .addChoices(
              { name: 'Rock', value: 'rock' },
              { name: 'Paper', value: 'paper' },
              { name: 'Scissors', value: 'scissors' }
            )
        )
    );
  }
}