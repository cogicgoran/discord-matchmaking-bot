import discord from 'discord.js';

export const client = new discord.Client({
  intents: ['Guilds', 'GuildMessages', 'MessageContent'],
});
