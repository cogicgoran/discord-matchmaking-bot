import discord, { ThreadAutoArchiveDuration } from 'discord.js';
import { createPlayer, getPlayer } from '../repository/players';
import { IPlayer } from '../interfaces';
import { matchmakingQueue } from '../data/queue';
import { makeLobby } from '../lobbyGenerator';
import { client as discordClient } from '../discord-client/discord-client';
import config from '../config';

export async function queueCommand(message: discord.Message<boolean>) {
    try {
        let player = await getPlayer(message.author.id);
        if (!player) {
            const playerData: IPlayer = {
                discordId: message.author.id,
                blacklistedPlayerId: undefined,
                username: message.author.username,
                globalName: message.author.globalName ?? message.author.username,
                rating: 1
            }
            player = await createPlayer(playerData);
        };
        if (matchmakingQueue.includes(player.discordId)) {

            await (await message.startThread({ name: 'Already queued', autoArchiveDuration: ThreadAutoArchiveDuration.OneHour })).send('You are already queued');
            setTimeout(async () => {
                try {
                    await message.thread?.delete();
                } catch (error) {
                    console.log('[DeleteThread]:', error);
                }
            }, 5000);
            return;
        }
        matchmakingQueue.push(player.discordId);
        // TODO: what if multiple requests are sent simultaneously, research how node functions more in depth
        if (matchmakingQueue.length === config.MAX_PLAYERS_IN_LOBBY) {
            const lobbyResults = await makeLobby(matchmakingQueue);
            const channel = await discordClient.channels.fetch(message.channel.id);
            await (channel as any).send(lobbyResults.print()); // TODO: Investigate, I found this method, but it's not listed in types for some reason
        }
    } catch (error) {
        console.log('[ERROR: QueueCommand]:', error);
    } finally {
        if (matchmakingQueue.length === config.MAX_PLAYERS_IN_LOBBY) {
            matchmakingQueue.splice(0);
        }
    }
}

export function matchmakingLimitCommand(maxPlayersInLobby: 2 | 10) {
    config.setMatchmakingLimit(maxPlayersInLobby);
    matchmakingQueue.splice(0);
}

export async function getLobbyCommand(message: discord.Message<boolean>) {
    try {
        if (matchmakingQueue.length === 0) {
            await message.reply("Lobby is empty");
            return;
        }
        let output = `Players in lobby: ${matchmakingQueue.length}\n`;
        output += matchmakingQueue.map((userDiscordId) => `- <@${userDiscordId}>`).join('\n');
        await message.channel.send(output);
    } catch (error) {
        console.log('[GetLobbyCommand]:', error);
    }
}