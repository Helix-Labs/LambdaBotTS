import { Command } from '@sapphire/framework';
import { Message, EmbedBuilder } from 'discord.js';

export class ServerRolesCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'serverroles',
      aliases: ['roles'],
      description: 'Shows all roles in this server',
    });
  }

  public async messageRun(message: Message) {
    if (!message.guild) {
      return message.reply('This command can only be used in a server!');
    }

    const roles = message.guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map(role => role.toString());

    const embed = new EmbedBuilder()
      .setTitle(`Roles in ${message.guild.name}`)
      .setColor('Blue')
      .setTimestamp();

    if (roles.length === 0) {
      embed.setDescription('This server has no roles.');
    } else {
      // Split roles into chunks to avoid embed field limits
      const chunks = [];
      let currentChunk = '';

      for (const role of roles) {
        if ((currentChunk + role).length > 1024) {
          chunks.push(currentChunk.trim());
          currentChunk = role;
        } else {
          currentChunk += (currentChunk ? ' ' : '') + role;
        }
      }

      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }

      chunks.forEach((chunk, index) => {
        embed.addFields({
          name: index === 0 ? `Roles (${roles.length})` : '\u200B',
          value: chunk,
          inline: false
        });
      });
    }

    return message.reply({ embeds: [embed] });
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    if (!interaction.guild) {
      return interaction.reply('This command can only be used in a server!');
    }

    const roles = interaction.guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map(role => role.toString());

    const embed = new EmbedBuilder()
      .setTitle(`Roles in ${interaction.guild.name}`)
      .setColor('Blue')
      .setTimestamp();

    if (roles.length === 0) {
      embed.setDescription('This server has no roles.');
    } else {
      // Split roles into chunks to avoid embed field limits
      const chunks = [];
      let currentChunk = '';

      for (const role of roles) {
        if ((currentChunk + role).length > 1024) {
          chunks.push(currentChunk.trim());
          currentChunk = role;
        } else {
          currentChunk += (currentChunk ? ' ' : '') + role;
        }
      }

      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }

      chunks.forEach((chunk, index) => {
        embed.addFields({
          name: index === 0 ? `Roles (${roles.length})` : '\u200B',
          value: chunk,
          inline: false
        });
      });
    }

    return interaction.reply({ embeds: [embed] });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
    );
  }
}