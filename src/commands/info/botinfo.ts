import { Command } from '@sapphire/framework';
import { EmbedBuilder, Message, PermissionFlagsBits } from 'discord.js';
import { uptime } from 'process';
import stripIndent from 'common-tags';

export class BotInfoCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'botinfo',
      aliases: ['bi', 'info'],
      description: 'Sends the bot info',
    });
  }

  public async messageRun(message: Message) {
    const client = this.container.client;
    const selfUser = client.user!;

    // Get command count (excluding owner commands if any)
    const commandCount = this.container.stores.get('commands').size;

    // Calculate uptime
    const uptimeMs = uptime() * 1000;
    const uptimeString = this.formatUptime(uptimeMs);

    // Calculate total members and average
    const totalMembers = this.container.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const averageMembersPerGuild = Math.round(totalMembers / this.container.client.guilds.cache.size);

    const embed = new EmbedBuilder()
      .setTitle('🤖 Bot Info')
      .setDescription('Made with ♥ by ZoneInfinity')
      .setAuthor({
        name: 'Zone#0001',
        iconURL: selfUser.displayAvatarURL(),
        url: selfUser.displayAvatarURL()
      })
      .addFields(
        {
          name: 'General 👓',
          value: stripIndent`\`\`\`css
                Owner : [Zone#0001]
                Library : [Discord.js]
                Prefix : [/]
                Command Number : [${commandCount}]
                \`\`\``,
          inline: false
        },
        {
          name: 'Client λ',
          value: stripIndent`\`\`\`css
                Client ID : [${selfUser.id}]
                Servers : [${client.guilds.cache.size}]
                Users : [${totalMembers}]
                Average Users per Server : [${averageMembersPerGuild}]
                WS Ping : [${client.ws.ping}ms]
                Uptime : [${uptimeString}]
                \`\`\``,
          inline: false
        },
        {
          name: 'Links 🔗',
          value: '** [Github](https://github.com/4ngel2769/LambdaBotTS) • [TopGG](https://top.gg/bot/752052866809593906) • [Support Server](https://discord.com/invite/XCNehWVrH7)**',
          inline: false
        }
      )
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const client = this.container.client;
    const selfUser = client.user!;

    // Get command count (excluding owner commands if any)
    const commandCount = this.container.stores.get('commands').size;

    // Calculate uptime
    const uptimeMs = uptime() * 1000;
    const uptimeString = this.formatUptime(uptimeMs);

    // Calculate total members and average
    const totalMembers = this.container.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const averageMembersPerGuild = Math.round(totalMembers / this.container.client.guilds.cache.size);

    const embed = new EmbedBuilder()
      .setTitle('🤖 Bot Info')
      .setDescription('Made with ♥ by Zone Community')
      .setAuthor({
        name: 'Zone#0001',
        iconURL: selfUser.displayAvatarURL(),
        url: selfUser.displayAvatarURL()
      })
      .addFields(
        {
          name: 'General 👓',
          value: `\`\`\`css\nOwner : [Zone#0001]\nLibrary : [Discord.js]\nPrefix : [/]\nCommand Number : [${commandCount}]\n\`\`\``,
          inline: false
        },
        {
          name: 'Client λ',
          value: stripIndent`\`\`\`css
                Client ID : [${selfUser.id}]
                Servers : [${client.guilds.cache.size}]
                Users : [${totalMembers}]
                Average Users per Server : [${averageMembersPerGuild}]
                WS Ping : [${client.ws.ping}ms]
                Uptime : [${uptimeString}]
                \`\`\``,
          inline: false
        },
        {
          name: 'Links 🔗',
          value: '** [Github](https://github.com/Zone-Infinity/LambdaDiscordBot) • [TopGG](https://top.gg/bot/752052866809593906) • [Support Server](https://discord.com/invite/XCNehWVrH7)**',
          inline: false
        }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
    );
  }

  private formatUptime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }
}