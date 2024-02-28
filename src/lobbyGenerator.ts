import config from './config';
import type { IPlayer, ILobbyPlayer } from './interfaces';
import { createMatch } from './repository/matches';
import { retrieveLobbyPlayers } from './repository/players';

function getSaltedRating(maxDeviation: number): number {
    return Math.random() * maxDeviation * (Math.random() > 0.5 ? -1 : 1)
}

function generateLobbyPlayer(player: IPlayer, allPlayers: Array<IPlayer>, maxDeviation: number): ILobbyPlayer {
    return {
        discordId: player.discordId,
        username: player.username,
        globalName: player.globalName,
        teamProbability: 5,
        rating: player.rating + getSaltedRating(maxDeviation),
        blacklistedPlayerId: player.blacklistedPlayerId,
        blacklistedBy: allPlayers.filter((otherPlayer) => otherPlayer.blacklistedPlayerId === player.discordId),
    }
}

function calculateTeamRating(players: Array<ILobbyPlayer>) {
    return players.reduce((tot, cur) => tot + cur.rating, 0);
}

export async function makeLobby(playerIds: Array<string>, guildId: string) {
    if (playerIds.length !== config.MAX_PLAYERS_IN_LOBBY) {
        throw new Error(`Invalid lobby size! Received lobby of size '${playerIds.length}'`);
    }

    const players = await retrieveLobbyPlayers(playerIds, guildId);
    let maxPlayerRatingDeviation = 0;
    for (let i = 1; i < players.length; i++) {
        maxPlayerRatingDeviation += (players[i].rating - players[i - 1].rating) / (playerIds.length - 1);
    }
    const lobbyPlayers: Array<ILobbyPlayer> = players.map((player) => generateLobbyPlayer(player, players, maxPlayerRatingDeviation));

    lobbyPlayers.sort((p1: ILobbyPlayer, p2: ILobbyPlayer) => p2.rating - p1.rating);

    const teamOne: Array<ILobbyPlayer> = [];
    const teamTwo: Array<ILobbyPlayer> = [];

    for (let i = 0; i < lobbyPlayers.length; i++) {
        if (calculateTeamRating(teamOne) >= calculateTeamRating(teamTwo) && teamTwo.length < config.MAX_PLAYERS_IN_LOBBY / 2) {
            teamTwo.push(lobbyPlayers[i]);
        } else if (teamOne.length === config.MAX_PLAYERS_IN_LOBBY / 2) {
            teamTwo.push(lobbyPlayers[i]);
        } else {
            teamOne.push(lobbyPlayers[i]);
        }
    }

    const matchData = await createMatch(teamOne, teamTwo);

    return {

        teamOne,
        teamTwo,
        print: (): string => {
            let output = `MATCH ID: ${matchData.insertedId}\n`;
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
