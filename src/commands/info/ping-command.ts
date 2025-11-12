import { Command } from '@sapphire/framework';
import { Message, EmbedBuilder } from 'discord.js';

export class PingCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'ping',
      description: 'Shows the current ping from the bot to the discord servers',
    });
  }

  public async messageRun(message: Message) {
    const sent = await message.reply('Pinging...');

    const restPing = this.container.client.ws.ping;
    const wsPing = Date.now() - sent.createdTimestamp;

    const embed = new EmbedBuilder()
      .setTitle('🏓 PING')
      .addFields(
        { name: '🔴 Rest ping', value: `${restPing}ms`, inline: true },
        { name: '🟡 WS ping', value: `${wsPing}ms`, inline: true }
      )
      .setColor('Green')
      .setTimestamp();

    return sent.edit({ content: '', embeds: [embed] });
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const sent = await interaction.deferReply();

    const restPing = this.container.client.ws.ping;
    const wsPing = Date.now() - interaction.createdTimestamp;

    const embed = new EmbedBuilder()
      .setTitle('🏓 PING')
      .addFields(
        { name: '🔴 Rest ping', value: `${restPing}ms`, inline: true },
        { name: '🟡 WS ping', value: `${wsPing}ms`, inline: true }
      )
      .setColor('Green')
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
    );
  }
}