import { getLobby } from './data/queue';
import type { IPlayer, ILobbyPlayer } from './interfaces';
import { createMatch } from './repository/matches';
import { retrieveLobbyPlayers } from './repository/players';

export class LobbyGenerator {
  static getSaltedRating(maxDeviation: number): number {
    return LobbyGenerator.getRatingDeviationMagnitude(maxDeviation) * LobbyGenerator.getRatingDeviationDirection();
  }

  static getRatingDeviationDirection() {
    return Math.random() > 0.5 ? -1 : 1;
  }

  static getRatingDeviationMagnitude(maxDeviation: number) {
    return Math.random() * maxDeviation;
  }

  static generateLobbyPlayer(player: IPlayer, allPlayers: Array<IPlayer>, maxDeviation: number): ILobbyPlayer {
    return {
      discordId: player.discordId,
      username: player.username,
      globalName: player.globalName,
      rating: player.rating + LobbyGenerator.getSaltedRating(maxDeviation),
      blacklistedPlayerId: player.blacklistedPlayerId,
      blacklistedBy: allPlayers.filter((otherPlayer) => otherPlayer.blacklistedPlayerId === player.discordId),
    };
  }

  static calculateTeamRating(players: Array<ILobbyPlayer>) {
    return players.reduce((tot, cur) => tot + cur.rating, 0);
  }

  static async makeLobby(playerIds: Array<string>, guildId: string) {
    const lobby = getLobby(guildId);
    if (playerIds.length !== lobby.playersInMatch) {
      throw new Error(`Invalid lobby size! Received lobby of size '${playerIds.length}'`);
    }

    const players = await retrieveLobbyPlayers(playerIds, guildId);
    let maxPlayerRatingDeviation = 0;
    for (let i = 1; i < players.length; i++) {
      maxPlayerRatingDeviation += (players[i].rating - players[i - 1].rating) / (playerIds.length - 1);
    }
    const lobbyPlayers: Array<ILobbyPlayer> = players.map((player) =>
      LobbyGenerator.generateLobbyPlayer(player, players, maxPlayerRatingDeviation)
    );

    lobbyPlayers.sort((p1: ILobbyPlayer, p2: ILobbyPlayer) => p2.rating - p1.rating);

    const { teamOne, teamTwo } = LobbyGenerator.createTeams(lobbyPlayers);

    const matchData = await createMatch({ guildId: guildId, teamOne, teamTwo, winner: null });

    return {
      teamOne,
      teamTwo,
      print: (): string => {
        let output = `MATCH ID: ${matchData.insertedId}\n`;
        output += 'Team A:\n';
        teamOne.forEach((player) => {
          output += `\t<@${player.discordId}>\n`;
        });
        output += 'Team B:\n';
        teamTwo.forEach((player) => {
          output += `\t<@${player.discordId}>\n`;
        });
        return output;
      },
    };
  }

  static createTeams(lobbyPlayers: Array<ILobbyPlayer>) {
    const playersPerTeam = lobbyPlayers.length / 2;
    const teamOne: Array<ILobbyPlayer> = [];
    const teamTwo: Array<ILobbyPlayer> = [];

    for (let i = 0; i < lobbyPlayers.length; i++) {
      if (LobbyGenerator.calculateTeamRating(teamOne) >= LobbyGenerator.calculateTeamRating(teamTwo) && teamTwo.length < playersPerTeam) {
        teamTwo.push(lobbyPlayers[i]);
      } else if (teamOne.length === playersPerTeam) {
        teamTwo.push(lobbyPlayers[i]);
      } else {
        teamOne.push(lobbyPlayers[i]);
      }
    }
    return {
      teamOne,
      teamTwo,
    };
  }
}
