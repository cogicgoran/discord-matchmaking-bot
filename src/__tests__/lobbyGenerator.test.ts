import { calculateNewRating } from '../services/player.service';
import { mockCreateLobbyPlayerWithRating, mockCreatePlayerWithRating } from '../__mocks__/mockFactory';
import { ILobbyPlayer, IPlayer } from '../interfaces';
import { ExplainVerbosity, ObjectId } from 'mongodb';
import { LobbyGenerator } from '../lobbyGenerator';
import * as playerRepository from '../repository/players';
import * as matchRepository from '../repository/matches';
import * as queueData from '../data/queue';

beforeEach(() => {
  jest.resetModules();
  jest.restoreAllMocks();
});

it('should create 2 teams with 5 players each', async () => {
  const spyGetQueue = jest.spyOn(queueData, 'getQueue');
  spyGetQueue.mockReturnValueOnce([]);
  const spyRetrieveLobbyPlayers = jest.spyOn(playerRepository, 'retrieveLobbyPlayers');
  spyRetrieveLobbyPlayers.mockResolvedValueOnce([
    mockCreatePlayerWithRating(1),
    mockCreatePlayerWithRating(1),
    mockCreatePlayerWithRating(1),
    mockCreatePlayerWithRating(1),
    mockCreatePlayerWithRating(1),
    mockCreatePlayerWithRating(1),
    mockCreatePlayerWithRating(1),
    mockCreatePlayerWithRating(1),
    mockCreatePlayerWithRating(1),
    mockCreatePlayerWithRating(1),
  ]);
  const spyCreateMatch = jest.spyOn(matchRepository, 'createMatch');
  spyCreateMatch.mockResolvedValueOnce({ insertedId: new ObjectId(), acknowledged: true });
  const teams = await LobbyGenerator.makeLobby(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], '1');
  expect(teams.teamOne.length).toBe(5);
  expect(teams.teamTwo.length).toBe(5);
});

test('team making algorithm, it should create teams balanced by rating', async () => {
  let teams;
  let lobbyPlayers: Array<ILobbyPlayer>;
  // Case 1
  lobbyPlayers = [mockCreateLobbyPlayerWithRating(9), mockCreateLobbyPlayerWithRating(3)];
  teams = LobbyGenerator.createTeams(lobbyPlayers);
  expect(LobbyGenerator.calculateTeamRating(teams.teamOne)).toBe(3);
  expect(LobbyGenerator.calculateTeamRating(teams.teamTwo)).toBe(9);
  // Case 2
  lobbyPlayers = [
    mockCreateLobbyPlayerWithRating(9),
    mockCreateLobbyPlayerWithRating(8),
    mockCreateLobbyPlayerWithRating(8),
    mockCreateLobbyPlayerWithRating(3),
  ];
  teams = LobbyGenerator.createTeams(lobbyPlayers);
  expect(LobbyGenerator.calculateTeamRating(teams.teamOne)).toBe(16);
  expect(LobbyGenerator.calculateTeamRating(teams.teamTwo)).toBe(12);
  // Case 4
  lobbyPlayers = [
    mockCreateLobbyPlayerWithRating(8),
    mockCreateLobbyPlayerWithRating(6),
    mockCreateLobbyPlayerWithRating(6),
    mockCreateLobbyPlayerWithRating(5),
    mockCreateLobbyPlayerWithRating(4),
    mockCreateLobbyPlayerWithRating(4),
    mockCreateLobbyPlayerWithRating(3),
    mockCreateLobbyPlayerWithRating(3),
  ];
  teams = LobbyGenerator.createTeams(lobbyPlayers);
  expect(LobbyGenerator.calculateTeamRating(teams.teamOne)).toBe(19);
  expect(LobbyGenerator.calculateTeamRating(teams.teamTwo)).toBe(20);
  // Case 5
  lobbyPlayers = [
    mockCreateLobbyPlayerWithRating(9),
    mockCreateLobbyPlayerWithRating(9),
    mockCreateLobbyPlayerWithRating(8),
    mockCreateLobbyPlayerWithRating(7),
    mockCreateLobbyPlayerWithRating(6),
    mockCreateLobbyPlayerWithRating(6),
    mockCreateLobbyPlayerWithRating(5),
    mockCreateLobbyPlayerWithRating(5),
    mockCreateLobbyPlayerWithRating(5),
    mockCreateLobbyPlayerWithRating(3),
  ];
  teams = LobbyGenerator.createTeams(lobbyPlayers);
  expect(LobbyGenerator.calculateTeamRating(teams.teamOne)).toBe(32);
  expect(LobbyGenerator.calculateTeamRating(teams.teamTwo)).toBe(31);
});

it('should calculate new rating after match correctly', () => {
  expect(calculateNewRating(2, 2, true)).toBe(2.2);
  expect(calculateNewRating(2, 2, false)).toBe(1.8);
  expect(calculateNewRating(5, 5, true)).toBe(5.2);
  expect(calculateNewRating(5, 5, false)).toBe(4.8);

  expect(calculateNewRating(5, 1, true)).toBe(5.04);
  expect(calculateNewRating(5, 1, false)).toBe(4);
  expect(calculateNewRating(1, 5, true)).toBe(2);
  expect(calculateNewRating(1, 5, false)).toBe(0.96);
});

test("generated lobby player's rating with no deviation", () => {
  const spyGenerateLobbyPlayer = jest.spyOn(LobbyGenerator, 'generateLobbyPlayer');
  spyGenerateLobbyPlayer.mockReturnValueOnce({
    discordId: '1',
    username: 'pUsername',
    globalName: 'pGlobalName',
    rating: 1,
    blacklistedPlayerId: undefined,
    blacklistedBy: [],
  });
  const player: IPlayer = {
    guildId: '1',
    discordId: '1',
    blacklistedPlayerId: undefined,
    username: 'pUsername',
    globalName: 'pGlobalName',
    rating: 1,
  };
  expect(LobbyGenerator.generateLobbyPlayer(player, [player], 0)).toEqual({
    discordId: '1',
    username: 'pUsername',
    globalName: 'pGlobalName',
    rating: 1,
    blacklistedPlayerId: undefined,
    blacklistedBy: [],
  });
});

test("generated lobby player's rating with deviation", () => {
  const spyGetSaltedRating = jest.spyOn(LobbyGenerator, 'getSaltedRating');
  let player: IPlayer = {
    guildId: '1',
    discordId: '1',
    blacklistedPlayerId: undefined,
    username: 'pUsername',
    globalName: 'pGlobalName',
    rating: 2,
  };
  spyGetSaltedRating.mockReturnValueOnce(1);

  let generatedLobbyPlayer = LobbyGenerator.generateLobbyPlayer(player, [player], 1);
  expect(spyGetSaltedRating).toHaveBeenCalled();
  expect(generatedLobbyPlayer).toMatchObject({
    discordId: '1',
    username: 'pUsername',
    globalName: 'pGlobalName',
    blacklistedPlayerId: undefined,
    blacklistedBy: [],
  });
  expect(generatedLobbyPlayer).toHaveProperty('rating');
  expect(generatedLobbyPlayer.rating).toBe(3);
});
