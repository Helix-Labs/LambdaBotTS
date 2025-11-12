import { Listener } from '@sapphire/framework';

export class InteractionCreateListener extends Listener<'interactionCreate'> {
  public run(interaction: any) {
    if (interaction.isButton()) {
      // Handle button interactions
      const [userId, action] = interaction.customId.split(':');
      if (interaction.user.id !== userId) return;

      switch (action) {
        case 'delete':
          interaction.deferUpdate();
          interaction.message.delete().catch(() => {});
          break;
        case 'done':
          interaction.deferUpdate();
          // Disable buttons if needed
          break;
        // Add more cases for pagination if implemented
      }
    }
  }
}