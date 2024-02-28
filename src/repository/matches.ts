import { Document, ObjectId, WithId } from 'mongodb';
import databaseClient from '../data/connection';
import { ILobbyPlayer, IMatch } from '../interfaces';

export async function createMatch(teamOne: Array<ILobbyPlayer>, teamTwo: Array<ILobbyPlayer>) {
    const matchData = await databaseClient.db('matchmaking').collection('matches').insertOne({ teamOne, teamTwo, winner: null });
    return matchData;
}

export async function getMatch(matchId: string): Promise<WithId<IMatch>> {
    const matchData = await databaseClient.db('matchmaking').collection('matches').findOne<WithId<IMatch>>({ _id: new ObjectId(matchId) });
    return matchData!;
}

export async function setWinnerMatch(match: WithId<IMatch>, winningTeam: 'A' | 'B') {
    const matchData = await databaseClient.db('matchmaking').collection('matches').updateOne({ _id: match._id }, { $set: { winner: winningTeam } });
    return matchData;
}