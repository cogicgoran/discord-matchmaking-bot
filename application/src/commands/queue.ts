import discord, { TextChannel, ThreadAutoArchiveDuration } from 'discord.js';
import { createPlayer, getPlayer } from '../repository/players';
import { IPlayer } from '../interfaces';
import { LobbyGenerator } from '../lobbyGenerator';
import { client as discordClient } from '../discord-client/discord-client';
import { addPlayerToQueue, getLobby } from '../data/queue';
import { DEFAULT_PLAYER_RATING } from '../utils/constants';

export async function queueCommand(message: discord.Message<boolean>) {
  const lobby = getLobby(message.guildId!);
  try {
    let player = await getPlayer(message.author.id, message.guildId!);
    if (!player) {
      const playerData: IPlayer = {
        guildId: message.guildId!,
        discordId: message.author.id,
        blacklistedPlayerId: undefined,
        username: message.author.username,
        globalName: message.author.globalName ?? message.author.username,
        rating: DEFAULT_PLAYER_RATING,
      };
      await createPlayer(playerData);
      player = (await getPlayer(playerData.discordId, message.guildId!))!;
    }
    if (lobby.queue.includes(player.discordId)) {
      await message.startThread({
        name: 'Already queued',
        autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
        reason: 'Player is already queued in lobby.',
      });
      setTimeout(async () => {
        try {
          await message.thread?.delete();
        } catch (error) {
          console.log('[DeleteThreadError]:', error);
        }
      }, 5000);
      return;
    }
    addPlayerToQueue(message.guildId!, player.discordId);
    // TODO: what if multiple requests are sent simultaneously, research how node functions more in depth
    if (lobby.queue.length === lobby.playersInMatch) {
      const lobbyResults = await LobbyGenerator.makeLobby(lobby.queue, message.guildId!);
      const channel = await discordClient.channels.fetch(message.channel.id);
      await (channel as TextChannel).send(lobbyResults.print());
    }
  } catch (error) {
    console.log('[ERROR: QueueCommand]:', error);
  } finally {
    if (lobby.queue.length === lobby.playersInMatch) {
      lobby.queue.splice(0);
    }
  }
}

export function matchmakingLimitCommand(guildId: string, maxPlayersInLobby: 2 | 10) {
  const lobby = getLobby(guildId)!;
  lobby.playersInMatch = maxPlayersInLobby;
  lobby.queue.splice(0);
}

export async function getLobbyCommand(message: discord.Message<boolean>) {
  const lobby = getLobby(message.guildId!)!;
  try {
    if (lobby.queue.length === 0) {
      await message.reply('Lobby is empty');
      return;
    }
    let output = `Players in lobby: ${lobby.queue.length}\n`;
    output += lobby.queue.map((userDiscordId) => `- <@${userDiscordId}>`).join('\n');
    await message.channel.send(output);
  } catch (error) {
    console.log('[GetLobbyCommand]:', error);
  }
}
