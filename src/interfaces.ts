export interface IPlayer {
    discordId: string;
    username: string;
    globalName: string;
    blacklistedPlayerId: string | undefined;
    ratings: Map<string, number>;
}

export interface ILobbyPlayer {
    discordId: string;
    username: string;
    globalName: string;
    rating: number;
    blacklistedPlayerId: string | undefined;
    blacklistedBy: Array<IPlayer>;
}
