import { IPlayer } from "../interfaces";
import databaseClient from '../data/connection';
import { Player } from "../data/Player";

export async function addPlayer(playerData: IPlayer) {
    const existingPlayer = await getPlayer(playerData.discordId);
    if (existingPlayer) { throw new Error("User already registered") };
    await databaseClient.db('matchmaking').collection('players').insertOne({ ...playerData });
}

export async function getPlayer(discordId: string): Promise<IPlayer | null> {
    const player = await databaseClient.db('matchmaking').collection('players').findOne({ discordId: discordId });
    if (player) return new Player(player);
    return null;
}

export async function patchPlayer(player: IPlayer, playerData: Pick<IPlayer, 'blacklistedPlayerId'>) {
    await databaseClient.db('matchmaking').collection('players').updateOne({ discordId: player.discordId }, { $set: { blacklistedPlayerId: playerData.blacklistedPlayerId } })
}

export async function createPlayer(playerData: IPlayer) {
    const operationResult = await databaseClient.db('matchmaking').collection('players').insertOne({ ...playerData });
    return operationResult;
}

export async function retrieveLobbyPlayers(playerIds: Array<string>): Promise<Array<IPlayer>> {
    const cursor = databaseClient.db('matchmaking').collection('players').find({ discordId: { $in: playerIds } })
    const players = await cursor.toArray();
    await cursor.close();
    return players.map((player) => new Player(player));
}

export async function updateRating(player: IPlayer) {
    try {
        await databaseClient.db('matchmaking').collection('players').updateOne({ discordId: player.discordId }, { $set: { rating: player.rating } })
    } catch (error) {
        console.log('[UpdateRatingError]:', error);
    }
}
