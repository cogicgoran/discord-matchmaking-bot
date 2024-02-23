import discord, { Guild } from 'discord.js';


const channelGuilds = new Map<string, string>();

export async function createChannelCommand(message: discord.Message<boolean>) {
    try {
        if (channelGuilds.has(message.guildId!)) {
            message.reply("Channel already created");
            return;
        };
        const channel = await message.guild?.channels.create({ name: "Matchmaking" });
        channelGuilds.set(message.guildId!, message.channelId);
        console.log('[ChannelCreated]: Guild name:', channel?.guild.name)
    } catch (error) {
        console.log('[BlacklistCommand]:', error);
    }
}

export function removeChannel(guildId: string) {
    try {
        channelGuilds.delete(guildId);
    } catch (error) {
        console.log('[BlacklistCommand]:', error);
    }
}

export function isBotChannel(message: discord.Message<boolean>) {
    return channelGuilds.has(message.guildId!);
}

export async function initChannel(guild: Guild) {
    try {
        const channel = await guild.channels.create({ name: "Matchmaking" });
        channelGuilds.set(guild.id, channel.id);
        console.log('[ChannelCreated]: Guild name:', channel?.guild.name)
    } catch (error) {
        console.log('[BlacklistCommand]:', error);
    }
}