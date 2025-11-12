import { Command } from '@sapphire/framework';
import { Message, EmbedBuilder } from 'discord.js';

export class PingCommand extends Command {
  public constructor(context: Command.Context, options: Command.Context) {
    super(context, {
      ...options,
      name: 'ping',
      description: 'Shows the current ping from the bot to the discord servers',
    });
  }

  public async messageRun(message: Message) {
    const sent = await message.reply('Pinging...');
    const timeDiff = sent.createdTimestamp - message.createdTimestamp;

    const wsPing = this.container.client.ws.ping;

    const embed = new EmbedBuilder()
      .setTitle('PING')
      .addFields(
        { name: '🏓 WS ping', value: `${wsPing}ms`, inline: true },
        { name: '📨 Message ping', value: `${timeDiff}ms`, inline: true }
      );

    return sent.edit({ content: null, embeds: [embed] });
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const sent = await interaction.deferReply();

    const wsPing = this.container.client.ws.ping;

    const embed = new EmbedBuilder()
      .setTitle('PING')
      .addFields(
        { name: '🏓 WS ping', value: `${wsPing}ms`, inline: true }
      );

    return interaction.editReply({ embeds: [embed] });
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('ping')
        .setDescription('Shows the current ping from the bot to the discord servers')
    );
  }
}