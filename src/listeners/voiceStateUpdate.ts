import { Listener } from '@sapphire/framework';

export class VoiceStateUpdateListener extends Listener<'voiceStateUpdate'> {
  public run(oldState: any, newState: any) {
    // If the bot left a voice channel
    if (oldState.channel && !newState.channel && oldState.member.id === oldState.guild.members.me.id) {
      // Reset music manager if implemented
      // For now, just log
      this.container.logger.info(`Bot left voice channel in ${oldState.guild.name}`);
    }
  }
}