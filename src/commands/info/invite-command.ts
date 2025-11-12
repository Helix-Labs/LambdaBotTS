import { Command } from '@sapphire/framework';
import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export class InviteCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'invite',
      description: 'Get the bot invite link and support server',
    });
  }

  public async messageRun(message: Message) {
    const embed = new EmbedBuilder()
      .setTitle('🤖 LambdaBot Invite')
      .setDescription('Click the button below to invite me to your server!')
      .setColor('Blue')
      .setTimestamp()
      .setFooter({ text: 'LambdaBot', iconURL: this.container.client.user?.displayAvatarURL() });

    const inviteButton = new ButtonBuilder()
      .setLabel('Invite Bot')
      .setStyle(ButtonStyle.Link)
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=${this.container.client.user?.id}&permissions=8&scope=bot%20applications.commands`);

    const supportButton = new ButtonBuilder()
      .setLabel('Support Server')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.gg/lambdabot'); // You'll need to update this with the actual support server URL

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(inviteButton, supportButton);

    return message.reply({ embeds: [embed], components: [row] });
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle('🤖 LambdaBot Invite')
      .setDescription('Click the button below to invite me to your server!')
      .setColor('Blue')
      .setTimestamp()
      .setFooter({ text: 'LambdaBot', iconURL: this.container.client.user?.displayAvatarURL() });

    const inviteButton = new ButtonBuilder()
      .setLabel('Invite Bot')
      .setStyle(ButtonStyle.Link)
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=${this.container.client.user?.id}&permissions=8&scope=bot%20applications.commands`);

    const supportButton = new ButtonBuilder()
      .setLabel('Support Server')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.gg/lambdabot'); // You'll need to update this with the actual support server URL

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(inviteButton, supportButton);

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