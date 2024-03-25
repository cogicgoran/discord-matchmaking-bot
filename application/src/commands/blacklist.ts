import discord from 'discord.js';
import { getPlayer, patchPlayer } from '../repository/players';

export async function blacklistCommand(message: discord.Message<boolean>) {
  try {
    const splitText = message.content.split('!blacklist');
    if (splitText.length !== 2 || splitText[1].length <= 1) {
      // handles if only @ is entered
      // Can username have '!blacklist' string in it's name?
      throw new Error(`Unexpected message content: ${message.content}`);
    }
    if (message.mentions.users.size !== 1) {
      throw new Error(`Unexpected message content: ${message.content}`);
    }
    const blacklistedUser = message.mentions.users.at(0);
    if (!blacklistedUser) {
      throw new Error(`Something went wrong: ${message.content}`);
    }
    if (message.author.id === blacklistedUser.id) {
      throw new Error(`Player cannot blacklist himself`);
    }
    const player = await getPlayer(message.author.id, message.guildId!);
    if (!player) {
      throw new Error(`User ${message.author.globalName || message.author.username} is not a player`);
    }
    await patchPlayer(player, { blacklistedPlayerId: blacklistedUser.id });
  } catch (error) {
    console.log('[BlacklistCommand]:', error);
  }
}

export async function getBlacklistCommand(message: discord.Message<boolean>) {
  try {
    const player = await getPlayer(message.author.id, message.guildId!);
    if (!player) {
      throw new Error('Player does not exist');
    }
    if (player.blacklistedPlayerId) {
      message.reply(`Blacklisted player: <@${player.blacklistedPlayerId}>`);
    } else {
      message.reply(`You don't have blacklisted player`);
    }
  } catch (error) {
    console.log('[GetBlacklistCommand]:', error);
  }
}
