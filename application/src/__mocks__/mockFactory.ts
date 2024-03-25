import { ILobbyPlayer, IPlayer } from '../interfaces';

export function mockCreatePlayerWithRating(rating: number): IPlayer {
  if (rating < 0 || rating > 10) throw new Error('Invalid mock rating');
  return {
    guildId: '1',
    discordId: '10',
    blacklistedPlayerId: undefined,
    username: 'Player 10',
    globalName: 'Player 10',
    rating: 1,
  };
}

export function mockCreateLobbyPlayerWithRating(rating: number): ILobbyPlayer {
  if (rating < 0 || rating > 10) throw new Error('Invalid mock rating');
  return {
    discordId: '10',
    blacklistedPlayerId: undefined,
    username: 'Player 10',
    globalName: 'Player 10',
    rating,
    blacklistedBy: [],
  };
}
