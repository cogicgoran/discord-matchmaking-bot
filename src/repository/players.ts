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

export async function createPlayer(playerData: IPlayer): Promise<IPlayer> {
    const player = await databaseClient.db('matchmaking').collection('players').insertOne({ ...playerData });
    return new Player(player);
}

export async function retrieveLobbyPlayers(playerIds: Array<string>): Promise<Array<IPlayer>> {
    const findResults = databaseClient.db('matchmaking').collection('players').find({ discordId: { $all: playerIds } });
    const players: Array<Player> = [];
    for await (const document of findResults) {
        players.push(new Player(document));
    }
    return players;
}

// export function blacklistPlayer(playerId: string, blacklistedPlayerId: string) {
//     if (!players.has(playerId)) {
//         throw new Error('Player does not exist');
//     }
//     if (!players.has(blacklistedPlayerId)) {
//         throw new Error('Blacklisted player does not exist');
//     }
//     players.get(playerId)!.blacklistedPlayerId = blacklistedPlayerId;
// }

// export function getPlayerForLobby(playerId: string): IPlayer | undefined {
//     return players.get(playerId);
// }

// export async function retrieveLobbyPlayers(playerId: Array<string>) {
//     const findResult = databaseClient.db('matchmaking').collection('players').find({discordId: discordId});
// }