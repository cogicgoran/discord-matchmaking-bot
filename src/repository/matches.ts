import databaseClient from '../data/connection';
import { ILobbyPlayer } from '../interfaces';

// export async function createMatch(teamOne: Array<ILobbyPlayer>, teamTwo: Array<ILobbyPlayer>) {
//     const matchData = await databaseClient.db('matchmaking').collection('matches').insertOne({ teamOne, teamTwo, winner: null });
//     console.log(matchData)
//     return matchData;
// }