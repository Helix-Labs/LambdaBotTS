import { Command } from '@sapphire/framework';
import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export class VoteCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'vote',
      description: 'Get voting links for the bot',
    });
  }

  public async messageRun(message: Message) {
    const embed = new EmbedBuilder()
      .setTitle('🗳️ Vote for LambdaBot')
      .setDescription('Help support LambdaBot by voting on these platforms!')
      .setColor('Gold')
      .setTimestamp()
      .setFooter({ text: 'LambdaBot', iconURL: this.container.client.user?.displayAvatarURL() });

    const topggButton = new ButtonBuilder()
      .setLabel('Top.gg')
      .setStyle(ButtonStyle.Link)
      .setURL('https://top.gg/bot/lambdabot/vote'); // You'll need to update this with the actual bot ID

    const discordbotlistButton = new ButtonBuilder()
      .setLabel('Discord Bot List')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discordbotlist.com/bots/lambdabot/upvote'); // You'll need to update this with the actual bot ID

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(topggButton, discordbotlistButton);

    return message.reply({ embeds: [embed], components: [row] });
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle('🗳️ Vote for LambdaBot')
      .setDescription('Help support LambdaBot by voting on these platforms!')
      .setColor('Gold')
      .setTimestamp()
      .setFooter({ text: 'LambdaBot', iconURL: this.container.client.user?.displayAvatarURL() });

    const topggButton = new ButtonBuilder()
      .setLabel('Top.gg')
      .setStyle(ButtonStyle.Link)
      .setURL('https://top.gg/bot/lambdabot/vote'); // You'll need to update this with the actual bot ID

    const discordbotlistButton = new ButtonBuilder()
      .setLabel('Discord Bot List')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discordbotlist.com/bots/lambdabot/upvote'); // You'll need to update this with the actual bot ID

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(topggButton, discordbotlistButton);

    return interaction.reply({ embeds: [embed], components: [row] });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
    );
  }
}