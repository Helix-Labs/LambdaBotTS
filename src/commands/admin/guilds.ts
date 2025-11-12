import { Command } from '@sapphire/framework';
import { Message, EmbedBuilder } from 'discord.js';

export class GuildsCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'guilds',
      description: 'List the guilds the bot is in',
    });
  }

  public async messageRun(message: Message) {
    const guilds = this.container.client.guilds.cache.map(g => `${g.name} (${g.id})`).join('\n');
    const embed = new EmbedBuilder()
      .setTitle('Guilds')
      .setDescription(guilds || 'No guilds');
    return message.reply({ embeds: [embed] });
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const guilds = this.container.client.guilds.cache.map(g => `${g.name} (${g.id})`).join('\n');
    const embed = new EmbedBuilder()
      .setTitle('Guilds')
      .setDescription(guilds || 'No guilds');
    return interaction.reply({ embeds: [embed] });
  }

  public async registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('guilds').setDescription('List the guilds the bot is in')
    );
  }
}