import { ILobbyPlayer, IPlayer } from "../interfaces";
import { retrieveLobbyPlayers, updateRating } from "../repository/players";

export async function updateRatings(matchData: { teamOne: Array<ILobbyPlayer>, teamTwo: Array<ILobbyPlayer> }, winningTeam: 'A' | 'B') {
    const playerIds: Array<string> = matchData.teamOne.map((player) => player.discordId).concat(matchData.teamTwo.map((player) => player.discordId));
    const players = await retrieveLobbyPlayers(playerIds);
    const playersUpdated = getPlayersAfterRatingCalculations(players, matchData, winningTeam);
    playersUpdated.forEach((player) => { updateRating(player) });
}

export function getPlayersAfterRatingCalculations(players: Array<IPlayer>, matchData: { teamOne: Array<ILobbyPlayer>, teamTwo: Array<ILobbyPlayer> }, winningTeam: 'A' | 'B') {
    const avgLobbyRating = players.reduce((tot, cur) => tot + cur.rating / players.length, 0);
    const teamAIds = matchData.teamOne.map((player) => player.discordId);
    players.forEach((player) => {
        const diffToMatchAvg = player.rating - avgLobbyRating;
        if (winningTeam === 'A') {
            if (teamAIds.includes(player.discordId)) {
                player.rating = Math.min(10, ratingChangeFn(player.rating, diffToMatchAvg, true));
            } else {
                player.rating = Math.max(0, ratingChangeFn(player.rating, diffToMatchAvg, false));
            }
        } else {
            if (teamAIds.includes(player.discordId)) {
                player.rating = Math.max(0, ratingChangeFn(player.rating, diffToMatchAvg, false));
            } else {
                player.rating = Math.min(10, ratingChangeFn(player.rating, diffToMatchAvg, true));
            }
        }
    });
    return players;
}

/**
 * 
 * @param currentRating
 * @param diffToMatchAvg In range [-10:10]
 * @returns 
 */
function ratingChangeFn(currentRating: number, diffToMatchAvg: number, isWin: boolean) {
    return currentRating + (Math.sign(isWin ? 1 : -1) * diffToMatchAvg) / (100 + 0.2)
}