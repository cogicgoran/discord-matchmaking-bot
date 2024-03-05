import { calculateNewRating } from '../services/player.service';

beforeEach(() => {
  jest.resetModules();
});

// it('should create 2 teams with 5 players each', async () => {
//   jest.setMock('../repository/players', {
//     __esModule: true,
//     retrieveLobbyPlayers: async (): Promise<Array<IPlayer>> => [
//       {
//         discordId: '1',
//         blacklistedPlayerId: undefined,
//         username: 'Player 1',
//         globalName: 'Player 1',
//         rating: 1,
//       },
//       {
//         discordId: '2',
//         blacklistedPlayerId: undefined,
//         username: 'Player 2',
//         globalName: 'Player 2',
//         rating: 1,
//       },
//       {
//         discordId: '3',
//         blacklistedPlayerId: undefined,
//         username: 'Player 3',
//         globalName: 'Player 3',
//         rating: 1,
//       },
//       {
//         discordId: '4',
//         blacklistedPlayerId: undefined,
//         username: 'Player 4',
//         globalName: 'Player 4',
//         rating: 1,
//       },
//       {
//         discordId: '5',
//         blacklistedPlayerId: undefined,
//         username: 'Player 5',
//         globalName: 'Player 5',
//         rating: 1,
//       },
//       {
//         discordId: '6',
//         blacklistedPlayerId: undefined,
//         username: 'Player 6',
//         globalName: 'Player 6',
//         rating: 1,
//       },
//       {
//         discordId: '7',
//         blacklistedPlayerId: undefined,
//         username: 'Player 7',
//         globalName: 'Player 7',
//         rating: 1,
//       },
//       {
//         discordId: '8',
//         blacklistedPlayerId: undefined,
//         username: 'Player 8',
//         globalName: 'Player 8',
//         rating: 1,
//       },
//       {
//         discordId: '9',
//         blacklistedPlayerId: undefined,
//         username: 'Player 9',
//         globalName: 'Player 9',
//         rating: 1,
//       },
//       {
//         discordId: '10',
//         blacklistedPlayerId: undefined,
//         username: 'Player 10',
//         globalName: 'Player 10',
//         rating: 1,
//       },
//     ],
//   });
//   jest.setMock('../repository/matches', {
//     __esModule: true,
//     createMatch: () => ({ insertedId: 'testId' }),
//   });
//   const { makeLobby } = require('../lobbyGenerator');
//   const teams = await makeLobby(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
//   expect(teams.teamOne.length).toBe(5);
//   expect(teams.teamTwo.length).toBe(5);
// });

// test('it should create teams balanced by rating', async () => {
//     jest.setMock("../repository/players", {
//         __esModule: true,
//         retrieveLobbyPlayers: async (): Promise<Array<IPlayer>> => [{
//             discordId: '1',
//             blacklistedPlayerId: undefined,
//             username: 'Player 1',
//             globalName: 'Player 1',
//             rating: 10,
//         },
//         {
//             discordId: '2',
//             blacklistedPlayerId: undefined,
//             username: 'Player 2',
//             globalName: 'Player 2',
//             rating: 10,
//         },
//         {
//             discordId: '3',
//             blacklistedPlayerId: undefined,
//             username: 'Player 3',
//             globalName: 'Player 3',
//             rating: 10,
//         },
//         {
//             discordId: '4',
//             blacklistedPlayerId: undefined,
//             username: 'Player 4',
//             globalName: 'Player 4',
//             rating: 10,
//         },
//         {
//             discordId: '5',
//             blacklistedPlayerId: undefined,
//             username: 'Player 5',
//             globalName: 'Player 5',
//             rating: 3,
//         },
//         {
//             discordId: '6',
//             blacklistedPlayerId: undefined,
//             username: 'Player 6',
//             globalName: 'Player 6',
//             rating: 1,
//         },
//         {
//             discordId: '7',
//             blacklistedPlayerId: undefined,
//             username: 'Player 7',
//             globalName: 'Player 7',
//             rating: 1,
//         },
//         {
//             discordId: '8',
//             blacklistedPlayerId: undefined,
//             username: 'Player 8',
//             globalName: 'Player 8',
//             rating: 1,
//         },
//         {
//             discordId: '9',
//             blacklistedPlayerId: undefined,
//             username: 'Player 9',
//             globalName: 'Player 9',
//             rating: 1,
//         },
//         {
//             discordId: '10',
//             blacklistedPlayerId: undefined,
//             username: 'Player 10',
//             globalName: 'Player 10',
//             rating: 1,
//         }
//         ]
//     });
//     const { makeLobby } = require('../lobbyGenerator');
//     const teams = await makeLobby(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
//     expect(teams.teamOne.filter((player: any) => player.rating > 5).length).toBeLessThan(3);
//     expect(teams.teamTwo.filter((player: any) => player.rating > 5).length).toBeLessThan(3);
// });

// test('it should create teams balanced by rating', async () => {
//     jest.setMock("../repository/players", {
//         __esModule: true,
//         retrieveLobbyPlayers: async (): Promise<Array<IPlayer>> => [{
//             discordId: '1',
//             blacklistedPlayerId: undefined,
//             username: 'Player 1',
//             globalName: 'Player 1',
//             rating: 1,
//         },
//         {
//             discordId: '2',
//             blacklistedPlayerId: undefined,
//             username: 'Player 2',
//             globalName: 'Player 2',
//             rating: 2,
//         },
//         {
//             discordId: '3',
//             blacklistedPlayerId: undefined,
//             username: 'Player 3',
//             globalName: 'Player 3',
//             rating: 3,
//         },
//         {
//             discordId: '4',
//             blacklistedPlayerId: undefined,
//             username: 'Player 4',
//             globalName: 'Player 4',
//             rating: 4,
//         },
//         {
//             discordId: '5',
//             blacklistedPlayerId: undefined,
//             username: 'Player 5',
//             globalName: 'Player 5',
//             rating: 5,

//         },
//         {
//             discordId: '6',
//             blacklistedPlayerId: undefined,
//             username: 'Player 6',
//             globalName: 'Player 6',
//             rating: 6,

//         },
//         {
//             discordId: '7',
//             blacklistedPlayerId: undefined,
//             username: 'Player 7',
//             globalName: 'Player 7',
//             rating: 7,

//         },
//         {
//             discordId: '8',
//             blacklistedPlayerId: undefined,
//             username: 'Player 8',
//             globalName: 'Player 8',
//             rating: 8,

//         },
//         {
//             discordId: '9',
//             blacklistedPlayerId: undefined,
//             username: 'Player 9',
//             globalName: 'Player 9',
//             rating: 9,
//         },
//         {
//             discordId: '10',
//             blacklistedPlayerId: undefined,
//             username: 'Player 10',
//             globalName: 'Player 10',
//             rating: 10,
//         }
//         ]
//     });
//     // jest.setMock("../lobbyGenerator")
//     const { makeLobby } = require('../lobbyGenerator');
//     const teams = await makeLobby(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
//     expect(teams.teamOne.filter((player: any) => player.rating > 5).length).toBeLessThan(3);
//     expect(teams.teamTwo.filter((player: any) => player.rating > 5).length).toBeLessThan(3);
// });

// test('Sort accordingly when players have blacklisted players, but no matching in lobby', () => {

// });

// test('Sort accordingly when only one player has blacklisted matched player', () => {

// });

it('should calculate new rating after match correctly', () => {
  // const { calculateNewRating } = require('../services/player.service');
  // export function calculateNewRating(currentRating: number, enemyAvgLobbyRating: number, isWin: boolean) {
  expect(calculateNewRating(2, 2, true)).toBe(2.2);
  expect(calculateNewRating(2, 2, false)).toBe(1.8);
  expect(calculateNewRating(5, 5, true)).toBe(5.2);
  expect(calculateNewRating(5, 5, false)).toBe(4.8);

  expect(calculateNewRating(5, 1, true)).toBe(5.04);
  expect(calculateNewRating(5, 1, false)).toBe(4);
  expect(calculateNewRating(1, 5, true)).toBe(2);
  expect(calculateNewRating(1, 5, false)).toBe(0.96);

  // expect(calculateNewRating(10, 0, true)).toBe(10);
  // expect(calculateNewRating(10, 0, false)).toBe(?);
  // expect(calculateNewRating(0, 10, true)).toBe(?);
  // expect(calculateNewRating(0, 10, false)).toBe(0);
});
