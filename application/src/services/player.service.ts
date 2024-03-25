import { WithId } from 'mongodb';
import { IMatch, IPlayer } from '../interfaces';
import { retrieveLobbyPlayers, updateRating } from '../repository/players';
import { MAX_RATING, MIN_RATING, RATING_CHANGE_ANCHOR } from '../utils/constants';

export async function updateRatings(matchData: WithId<IMatch>, winningTeam: 'A' | 'B') {
  const playerIds: Array<string> = matchData.teamOne
    .map((player) => player.discordId)
    .concat(matchData.teamTwo.map((player) => player.discordId));
  const players = await retrieveLobbyPlayers(playerIds, matchData.guildId);
  const playersUpdated = getPlayersAfterRatingCalculations(players, matchData, winningTeam);
  playersUpdated.forEach((player) => {
    updateRating(player);
  });
}

export function getPlayersAfterRatingCalculations(players: Array<IPlayer>, matchData: WithId<IMatch>, winningTeam: 'A' | 'B') {
  const teamAIds = matchData.teamOne.map((player) => player.discordId);
  let teamAAVG = 0;
  let teamBAVG = 0;
  players.forEach((player) => {
    if (teamAIds.includes(player.discordId)) {
      teamAAVG += player.rating / (players.length / 2);
    } else {
      teamBAVG += player.rating / (players.length / 2);
    }
  });

  players.forEach((player) => {
    if (winningTeam === 'A') {
      if (teamAIds.includes(player.discordId)) {
        player.rating = calculateNewRating(player.rating, teamBAVG, true);
        return;
      }
      player.rating = calculateNewRating(player.rating, teamAAVG, false);
      return;
    } else {
      if (teamAIds.includes(player.discordId)) {
        player.rating = calculateNewRating(player.rating, teamBAVG, false);
        return;
      }
      player.rating = calculateNewRating(player.rating, teamAAVG, true);
      return;
    }
  });

  return players;
}

export function calculateNewRating(currentRating: number, enemyTeamAvgRating: number, isWin: boolean) {
  let calculatedRating: number;
  if (isWin) {
    calculatedRating = currentRating + (RATING_CHANGE_ANCHOR * enemyTeamAvgRating) / currentRating;
  } else {
    calculatedRating = currentRating - (RATING_CHANGE_ANCHOR * currentRating) / enemyTeamAvgRating;
  }
  return Math.max(Math.min(calculatedRating, MAX_RATING), MIN_RATING);
}
