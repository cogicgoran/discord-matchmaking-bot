import { IPlayer } from "../interfaces";
import databaseClient from '../data/connection';
import { Player } from "../data/Player";

export async function addPlayer(playerData: IPlayer) {
    const existingPlayer = await getPlayer(playerData.discordId, playerData.guildId);
    if (existingPlayer) { throw new Error("User already registered") };
    await databaseClient.db('matchmaking').collection('players').insertOne({ ...playerData });
}

export async function getPlayer(discordId: string, guildId: string): Promise<IPlayer | null> {
    const player = await databaseClient.db('matchmaking').collection('players').findOne({ discordId, guildId });
    if (player) return new Player(player);
    return null;
}

export async function patchPlayer(player: IPlayer, playerData: Pick<IPlayer, 'blacklistedPlayerId'>) {
    await databaseClient.db('matchmaking').collection('players').updateOne({ discordId: player.discordId, guildId: player.guildId }, { $set: { blacklistedPlayerId: playerData.blacklistedPlayerId } })
}

export async function createPlayer(playerData: IPlayer) {
    const operationResult = await databaseClient.db('matchmaking').collection('players').insertOne({ ...playerData });
    return operationResult;
}

export async function retrieveLobbyPlayers(playerIds: Array<string>, guildId: string): Promise<Array<IPlayer>> {
    const cursor = databaseClient.db('matchmaking').collection('players').find({ discordId: { $in: playerIds }, guildId })
    const players = await cursor.toArray();
    await cursor.close();
    return players.map((player) => new Player(player));
}

export async function updateRating(player: IPlayer) {
    try {
        await databaseClient.db('matchmaking').collection('players').updateOne({ discordId: player.discordId, guildId: player.guildId }, { $set: { rating: player.rating } })
    } catch (error) {
        console.log('[UpdateRatingError]:', error);
    }
}

export async function getTopRated(guildId: string) {
    const cursor = databaseClient.db('matchmaking').collection('players').find({ guildId }, { limit: 10, sort: { rating: 'desc' } });
    const players = await cursor.toArray();
    return players;
}
