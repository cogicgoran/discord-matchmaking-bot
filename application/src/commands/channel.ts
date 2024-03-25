import discord, { Guild, GuildBasedChannel, NonThreadGuildBasedChannel } from 'discord.js';

// map guildId channelId
const channelGuilds = new Map<string, string>();

export async function createChannelCommand(message: discord.Message<boolean>) {
  try {
    if (channelGuilds.has(message.guildId!)) {
      message.reply('Channel already created');
      return;
    }
    const channel = await message.guild?.channels.create({ name: 'Matchmaking' });
    channelGuilds.set(message.guildId!, channel!.id);
    console.log('[ChannelCreated]: Guild name:', channel?.guild.name);
  } catch (error) {
    console.log('[BlacklistCommand]:', error);
  }
}

export function removeChannel(channel: NonThreadGuildBasedChannel) {
  try {
    if (!channelGuilds.has(channel.guildId)) return;
    channelGuilds.delete(channelGuilds.get(channel.guildId)!);
  } catch (error) {
    console.log('[ChannelRemove]:', error);
  }
}

export function registerChannel(channel: GuildBasedChannel) {
  channelGuilds.set(channel.guildId, channel.id);
}

export function removeGuild(guildId: string) {
  try {
    channelGuilds.delete(guildId);
  } catch (error) {
    console.log('[GuildRemove]:', error);
  }
}

export function isBotChannel(message: discord.Message<boolean>) {
  if (!channelGuilds.has(message.guildId!)) return false;
  return message.channelId === channelGuilds.get(message.guildId!);
}

export async function initChannel(guild: Guild) {
  try {
    const channel = await guild.channels.create({ name: 'Matchmaking' });
    channelGuilds.set(guild.id, channel.id);
    console.log('[ChannelCreated]: Guild name:', channel?.guild.name);
  } catch (error) {
    console.log('[BlacklistCommand]:', error);
  }
}
