import discord from 'discord.js';
import { getTopRated } from '../repository/players';

export async function getTopRatedCommand(message: discord.Message<boolean>) {
  try {
    const players = await getTopRated(message.guildId!);
    const output = players.map((player) => `<@${player.discordId}>: ${Number(player.rating).toFixed(2)}`).join('\n');
    message.reply(output);
  } catch (error) {
    console.log('[GetTopRatedError]:', error);
  }
}
