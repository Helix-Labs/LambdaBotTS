import { Command } from '@sapphire/framework';
import { EmbedBuilder, Message } from 'discord.js';

enum HelpCategory {
  COM = 'Common',
  IMAGES = 'Images',
  FUN = 'Fun',
  INFO = 'Info',
  MUSIC = 'Music',
  GAME = 'Game',
  UTIL = 'Utilities',
  SETTINGS = 'Settings',
  OWNER = 'Owner'
}

export class HelpCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'help',
      aliases: ['commands', 'cmd', 'elp'],
      description: 'Shows the list with commands in the bot',
      detailedDescription: 'Displays help for commands or lists all command categories.',
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1);
    const prefix = '/'; // Assuming slash commands, but for message commands

    if (args.length === 0) {
      return this.showMainHelp(message, prefix);
    }

    const search = args[0].toLowerCase();
    const command = this.container.stores.get('commands').get(search);

    if (command) {
      return this.showCommandHelp(message, command, prefix);
    }

    // Check if it's a category
    const category = this.getCategory(search);
    if (category !== HelpCategory.OWNER) { // Exclude owner
      return this.showCategoryHelp(message, category);
    }

    return message.reply(`Nothing found for \`${search}\``);
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand(false);
    const commandName = interaction.options.getString('command');
    const categoryName = interaction.options.getString('category');

    if (subcommand === 'command' && commandName) {
      const command = this.container.stores.get('commands').get(commandName.toLowerCase());
      if (command) {
        return this.showCommandHelpInteraction(interaction, command);
      }
      return interaction.reply(`Command \`${commandName}\` not found.`);
    }

    if (subcommand === 'category' && categoryName) {
      const category = this.getCategory(categoryName);
      if (category !== HelpCategory.OWNER) {
        return this.showCategoryHelpInteraction(interaction, category);
      }
      return interaction.reply(`Category \`${categoryName}\` not found.`);
    }

    return this.showMainHelpInteraction(interaction);
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addSubcommand((subcommand) =>
          subcommand
            .setName('command')
            .setDescription('Get help for a specific command')
            .addStringOption((option) =>
              option
                .setName('command')
                .setDescription('The command name')
                .setRequired(true)
                .setAutocomplete(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('category')
            .setDescription('Get help for a command category')
            .addStringOption((option) =>
              option
                .setName('category')
                .setDescription('The category name')
                .setRequired(true)
                .setChoices(
                  { name: 'Common', value: 'common' },
                  { name: 'Images', value: 'images' },
                  { name: 'Fun', value: 'fun' },
                  { name: 'Info', value: 'info' },
                  { name: 'Music', value: 'music' },
                  { name: 'Game', value: 'game' },
                  { name: 'Utilities', value: 'utilities' },
                  { name: 'Settings', value: 'settings' }
                )
            )
        )
    );
  }

  private async showMainHelp(message: Message, prefix: string) {
    const categoryMap = this.getAvailableCategories();
    const entries = Array.from(categoryMap.entries());

    const categories = entries
      .filter(([cat]) => cat !== HelpCategory.OWNER)
      .map(([cat, commands]) => ({
        name: cat,
        desc: this.getCategoryDescription(cat),
        emote: this.getCategoryEmote(cat),
        count: commands.length
      }));

    const desc = `\`${prefix}help <category>\`\n${categories.map(cat => `**${cat.emote} ${cat.name}** (${cat.count} commands) : \`${cat.desc}\``).join('\n')}`;

    const embed = new EmbedBuilder()
      .setTitle('**λ** Help')
      .setDescription('**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=752052866809593906&permissions=540375616&scope=bot)** | **Join our [Support Server](https://discord.com/invite/XCNehWVrH7)**\n' +
        `**Bot prefix** : \`\`${prefix}\`\`\n` +
        '```A Fun Bot which has many commands       \n' +
        'It provides you with some Common commands\n' +
        'Some Fun and most important MUSIC !! 😄 \n' +
        'If you have any confusion about the bot, \n' +
        '   Contact Zone#0001 for help, bugs and suggestions    \n' +
        '      for help, bugs and suggestions    ```\n' +
        '**Take a look on these commands** λ')
      .addFields({ name: 'Command Categories', value: desc, inline: false })
      .setFooter({ text: `Total Commands : ${this.container.stores.get('commands').size}` })
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }

  private async showMainHelpInteraction(interaction: Command.ChatInputCommandInteraction) {
    const categoryMap = this.getAvailableCategories();
    const entries = Array.from(categoryMap.entries());

    const categories = entries
      .filter(([cat]) => cat !== HelpCategory.OWNER)
      .map(([cat, commands]) => ({
        name: cat,
        desc: this.getCategoryDescription(cat),
        emote: this.getCategoryEmote(cat),
        count: commands.length
      }));

    const desc = categories.map(cat => `**${cat.emote} ${cat.name}** (${cat.count} commands) : \`${cat.desc}\``).join('\n');

    const embed = new EmbedBuilder()
      .setTitle('**λ** Help')
      .setDescription('**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=752052866809593906&permissions=540375616&scope=bot)** | **Join our [Support Server](https://discord.com/invite/XCNehWVrH7)**\n' +
        '**Bot prefix** : `/`\n' +
        '```A Fun Bot which has many commands       \n' +
        'It provides you with some Common commands\n' +
        'Some Fun and most important MUSIC !! 😄 \n' +
        'If you have any confusion about the bot, \n' +
        '   Contact Zone#0001 for help, bugs and suggestions    \n' +
        '      for help, bugs and suggestions    ```\n' +
        '**Take a look on these commands** λ')
      .addFields({ name: 'Command Categories', value: desc, inline: false })
      .setFooter({ text: `Total Commands : ${this.container.stores.get('commands').size}` })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }

  private async showCommandHelp(message: Message, command: Command, prefix: string) {
    const help = command.description || 'No description available.';
    const aliases = command.aliases?.length ? command.aliases.join(', ') : 'None';

    return message.reply(`Command\`\`\`prolog\n${help.toUpperCase()}\nALIASES : ${aliases}\`\`\``);
  }

  private async showCommandHelpInteraction(interaction: Command.ChatInputCommandInteraction, command: Command) {
    const help = command.description || 'No description available.';
    const aliases = command.aliases?.length ? command.aliases.join(', ') : 'None';

    return interaction.reply(`Command\`\`\`prolog\n${help.toUpperCase()}\nALIASES : ${aliases}\`\`\``);
  }

  private async showCategoryHelp(message: Message, category: HelpCategory) {
    const commands = this.container.stores.get('commands').filter(cmd => this.getCommandCategory(cmd) === category);
    const commandList = commands.map(cmd => `\`${cmd.name}\``).join(' | ');

    const embed = new EmbedBuilder()
      .setTitle(category)
      .setDescription(`\`\`\`${this.getCategoryDescription(category)}\`\`\``)
      .addFields({ name: 'Commands', value: commandList || 'No commands in this category.', inline: false })
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }

  private async showCategoryHelpInteraction(interaction: Command.ChatInputCommandInteraction, category: HelpCategory) {
    const commands = this.container.stores.get('commands').filter(cmd => this.getCommandCategory(cmd) === category);
    const commandList = commands.map(cmd => `\`${cmd.name}\``).join(' | ');

    const embed = new EmbedBuilder()
      .setTitle(category)
      .setDescription(`\`\`\`${this.getCategoryDescription(category)}\`\`\``)
      .addFields({ name: 'Commands', value: commandList || 'No commands in this category.', inline: false })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }

  private getCategory(search: string): HelpCategory {
    const lower = search.toLowerCase();
    switch (lower) {
      case 'common': case 'com': return HelpCategory.COM;
      case 'images': return HelpCategory.IMAGES;
      case 'fun': return HelpCategory.FUN;
      case 'info': return HelpCategory.INFO;
      case 'music': return HelpCategory.MUSIC;
      case 'game': return HelpCategory.GAME;
      case 'utilities': case 'util': return HelpCategory.UTIL;
      case 'settings': return HelpCategory.SETTINGS;
      default: return HelpCategory.OWNER;
    }
  }

  private getCommandCategory(command: Command): HelpCategory {
    // For now, assume based on path or something. This is simplified.
    // In real implementation, you'd have a way to categorize commands.
    const path = command.location.full;
    if (path.includes('common')) return HelpCategory.COM;
    if (path.includes('images')) return HelpCategory.IMAGES;
    if (path.includes('fun')) return HelpCategory.FUN;
    if (path.includes('info')) return HelpCategory.INFO;
    if (path.includes('music')) return HelpCategory.MUSIC;
    if (path.includes('games')) return HelpCategory.GAME;
    if (path.includes('utils')) return HelpCategory.UTIL;
    if (path.includes('settings')) return HelpCategory.SETTINGS;
    return HelpCategory.OWNER;
  }

  private getAvailableCategories(): Map<HelpCategory, Command[]> {
    const categoryMap = new Map<HelpCategory, Command[]>();
    for (const command of this.container.stores.get('commands').values()) {
      const cat = this.getCommandCategory(command);
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, []);
      }
      categoryMap.get(cat)!.push(command);
    }
    return categoryMap;
  }

  private getCategoryDescription(category: HelpCategory): string {
    switch (category) {
      case HelpCategory.COM: return 'Common Commands for the server members';
      case HelpCategory.IMAGES: return 'Commands that sends images';
      case HelpCategory.FUN: return 'Fun Commands which include games and images';
      case HelpCategory.INFO: return 'Info Commands for info of the bot, server and members';
      case HelpCategory.MUSIC: return 'Music Commands when you are in a Voice Channel';
      case HelpCategory.GAME: return 'Commands to play Small fun games';
      case HelpCategory.UTIL: return 'Commands to generate String and Images';
      case HelpCategory.SETTINGS: return 'Commands to get and change Server Settings';
      default: return 'Unknown';
    }
  }

  private getCategoryEmote(category: HelpCategory): string {
    switch (category) {
      case HelpCategory.COM: return 'λ';
      case HelpCategory.IMAGES: return '🎮';
      case HelpCategory.FUN: return 'ℹ️';
      case HelpCategory.INFO: return '🎵';
      case HelpCategory.MUSIC: return '🎉';
      case HelpCategory.GAME: return '😊';
      case HelpCategory.UTIL: return '🛠️';
      case HelpCategory.SETTINGS: return '⚙️';
      default: return '❓';
    }
  }
}