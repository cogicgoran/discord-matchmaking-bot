export interface IPlayer {
    discordId: string;
    username: string;
    globalName: string;
    blacklistedPlayerId: string | undefined;
    rating: number;
}

export interface ILobbyPlayer {
    discordId: string;
    username: string;
    globalName: string;
    rating: number;
    blacklistedPlayerId: string | undefined;
    blacklistedBy: Array<IPlayer>;
    teamProbability: number;
}
