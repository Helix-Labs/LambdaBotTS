import { Command } from '@sapphire/framework';
import { Message, EmbedBuilder } from 'discord.js';

const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

export class PollCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'poll',
      description: 'Create a poll',
    });
  }

  public async messageRun(message: Message) {
    const content = message.content.split(' ').slice(1).join(' ');
    const split = content.split(';').map(s => s.trim()).filter(s => s);

    if (split.length < 3) {
      return message.reply('Need at least a question and 2 options. Usage: poll <question> ; <option1> ; <option2> ; ...');
    }

    if (split.length > 11) {
      return message.reply('Cannot have more than 10 options');
    }

    const question = split[0];
    const options = split.slice(1);

    const optionText = options.map((opt, i) => `${numberEmojis[i]} ${opt}`).join('\n');

    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Poll' })
      .setTitle(`❓ ${question}`)
      .setDescription(optionText);

    const pollMessage = await message.channel.send({ embeds: [embed] });

    for (let i = 0; i < options.length; i++) {
      await pollMessage.react(numberEmojis[i]);
    }
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const question = interaction.options.getString('question', true);
    const options = [];
    for (let i = 1; i <= 10; i++) {
      const opt = interaction.options.getString(`option${i}`);
      if (opt) options.push(opt);
    }

    if (options.length < 2) {
      return interaction.reply('Need at least 2 options');
    }

    const optionText = options.map((opt, i) => `${numberEmojis[i]} ${opt}`).join('\n');

    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Poll' })
      .setTitle(`❓ ${question}`)
      .setDescription(optionText);

    const pollMessage = await interaction.reply({ embeds: [embed], fetchReply: true });

    for (let i = 0; i < options.length; i++) {
      await pollMessage.react(numberEmojis[i]);
    }
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    const builder = registry.registerChatInputCommand((builder) =>
      builder.setName('poll')
        .setDescription('Create a poll')
        .addStringOption(option =>
          option.setName('question')
            .setDescription('The poll question')
            .setRequired(true)
        )
    );

    for (let i = 1; i <= 10; i++) {
      builder.addStringOption(option =>
        option.setName(`option${i}`)
          .setDescription(`Option ${i}`)
          .setRequired(i <= 2)
      );
    }
  }
}