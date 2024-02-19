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
    lobbyPlayers.sort((a: ILobbyPlayer, b: ILobbyPlayer) => {
        return a.rating - b.rating;
    });

    const teamOne: Array<ILobbyPlayer> = [];
    const teamTwo: Array<ILobbyPlayer> = [];
    // Always sorts by rating, teams are predictable with same group of people
    for (let i = 0; i < players.length; i++) {
        if (i % 2 === 0) {
            teamOne.push(lobbyPlayers[i]);
        } else {
            teamTwo.push(lobbyPlayers[i]);
        }
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