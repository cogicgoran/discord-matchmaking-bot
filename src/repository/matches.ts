import { ObjectId, WithId } from 'mongodb';
import databaseClient from '../data/connection';
import { IMatch } from '../interfaces';

export async function createMatch(matchData: IMatch) {
    const match = await databaseClient.db('matchmaking').collection('matches').insertOne(matchData);
    return match;
}

export async function getMatch(matchId: string): Promise<WithId<IMatch>> {
    const matchData = await databaseClient.db('matchmaking').collection('matches').findOne<WithId<IMatch>>({ _id: new ObjectId(matchId) });
    return matchData!;
}

export async function setWinnerMatch(match: WithId<IMatch>, winningTeam: 'A' | 'B') {
    const matchData = await databaseClient.db('matchmaking').collection('matches').updateOne({ _id: match._id }, { $set: { winner: winningTeam } });
    return matchData;
}