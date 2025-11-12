import { Command } from '@sapphire/framework';
import { EmbedBuilder, Message, User } from 'discord.js';

export class AvatarCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'avatar',
      aliases: ['av', 'pfp', 'avt', 'profilepic'],
      description: 'Sends the avatar of you or the user <mention/id>',
      detailedDescription: 'Shows the avatar of the mentioned user or the user with the provided ID. If no user is specified, shows your own avatar.',
    });
  }

  public async messageRun(message: Message) {
    const args = message.content.split(' ').slice(1);
    let user: User | null = null;

    if (args.length === 0) {
      user = message.author;
    } else {
      // Check for mentions
      const mentionedUser = message.mentions.users.first();
      if (mentionedUser) {
        user = mentionedUser;
      } else {
        // Check if it's a valid Discord ID
        const id = args[0];
        if (this.isDiscordID(id)) {
          try {
            user = await this.container.client.users.fetch(id);
          } catch {
            return message.reply('No user found with this ID.');
          }
        } else {
          return message.reply('Please provide a valid mention or user ID.');
        }
      }
    }

    if (!user) {
      return message.reply('Unable to find the user.');
    }

    const embed = new EmbedBuilder()
      .setImage(user.displayAvatarURL({ size: 2048 }))
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') ?? interaction.user;

    const embed = new EmbedBuilder()
      .setImage(user.displayAvatarURL({ size: 2048 }))
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('The user whose avatar to show')
            .setRequired(false)
        )
    );
  }

  private isDiscordID(s: string): boolean {
    const num = parseInt(s, 10);
    return !isNaN(num) && s.length === 18 && num > 0;
  }
}