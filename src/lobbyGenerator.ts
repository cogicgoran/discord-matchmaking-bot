import { blacklistCommand } from './commands/blacklist';
import config from './config';
import type { IPlayer, ILobbyPlayer } from './interfaces';
import { retrieveLobbyPlayers } from './repository/players';
import { MAX_PLAYERS_5V5, MAX_RANDOM_DEVIATION } from './utils/constants';

const DEFAULT_PLAYER_RATING = 2;

function calculateRating(ratings: Map<string, number>): number {
    if (ratings.size === 0) return DEFAULT_PLAYER_RATING;
    let total = 0;
    ratings.forEach((rating) => {
        total += rating;
    });
    return Number((total / ratings.size).toFixed(1));
}

function generateLobbyPlayer(player: IPlayer, allPlayers: Array<IPlayer>): ILobbyPlayer {
    return {
        discordId: player.discordId,
        username: player.username,
        globalName: player.globalName,
        teamProbability: 5,
        rating: calculateRating(player.ratings) + Math.random() * MAX_RANDOM_DEVIATION * (Math.random() > 0.5 ? -1 : 1),
        blacklistedPlayerId: player.blacklistedPlayerId,
        blacklistedBy: allPlayers.filter((otherPlayer) => otherPlayer.blacklistedPlayerId === player.discordId),
    }
}

export async function makeLobby(playerIds: Array<string>) {
    if (playerIds.length !== config.MAX_PLAYERS_IN_LOBBY) {
        throw new Error(`Invalid lobby size! Received lobby of size '${playerIds.length}'`);
    }

    const players = await retrieveLobbyPlayers(playerIds);
    const lobbyPlayers: Array<ILobbyPlayer> = players.map((player) => generateLobbyPlayer(player, players));
    lobbyPlayers.sort((p1: ILobbyPlayer, p2: ILobbyPlayer) => {
        return p1.rating - p2.rating;
    });

    const BLACKLIST_DEVIATION_SCORE = 4;

    lobbyPlayers.forEach((ply, idx) => { ply.teamProbability += idx * Math.sign(idx % 2 === 0 ? 1 : -1) });
    const teamOne: Array<ILobbyPlayer> = [];
    const teamTwo: Array<ILobbyPlayer> = [];
    for (let i = 0; i < players.length; i++) {
        if (i % 2 === 0) {
            if (lobbyPlayers[i].blacklistedPlayerId) {
                const blacklistedPlayer = lobbyPlayers.find((player) => player.discordId === lobbyPlayers[i].blacklistedPlayerId);
                if (blacklistedPlayer) {
                    lobbyPlayers[i].teamProbability += BLACKLIST_DEVIATION_SCORE;
                }
            }
        } else {
            if (lobbyPlayers[i].blacklistedPlayerId) {
                const blacklistedPlayer = lobbyPlayers.find((player) => player.discordId === lobbyPlayers[i].blacklistedPlayerId);
                if (blacklistedPlayer) {
                    lobbyPlayers[i].teamProbability -= BLACKLIST_DEVIATION_SCORE;
                }
            }
        }
    }
    lobbyPlayers.sort((p1, p2) => p1.teamProbability - p2.teamProbability);
    let i = 0;
    while (lobbyPlayers.length > 0) {
        if (i % 2 === 0) {
            teamOne.push(lobbyPlayers.shift()!);
        } else {
            teamTwo.push(lobbyPlayers.pop()!);
        }
        i++;
    }

    return {
        teamOne,
        teamTwo,
        print: (): string => {
            let output = '';
            output += 'Team A:\n';
            teamOne.forEach((player) => {
                output += `\t<@${player.discordId}>\n`;
            })
            output += 'Team B:\n';
            teamTwo.forEach((player) => {
                output += `\t<@${player.discordId}>\n`;
            })
            return output;
        }
    }
}

// Priority: blacklisted