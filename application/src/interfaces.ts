export interface IPlayer {
  guildId: string;
  discordId: string;
  username: string;
  globalName: string;
  rating: number;
  blacklistedPlayerId: string | undefined;
}

export interface ILobbyPlayer extends Pick<IPlayer, 'discordId' | 'globalName' | 'rating' | 'username' | 'blacklistedPlayerId'> {
  blacklistedBy: Array<IPlayer>;
}

export interface ILobby {
  queue: Array<string>;
  playersInMatch: number;
}

export interface IMatch {
  guildId: string;
  teamOne: Array<ILobbyPlayer>;
  teamTwo: Array<ILobbyPlayer>;
  winner: 'A' | 'B' | null;
}
