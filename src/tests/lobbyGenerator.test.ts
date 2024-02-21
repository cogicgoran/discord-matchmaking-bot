import { IPlayer } from "../interfaces";

beforeEach(() => {
    jest.resetModules();
})

it('should create 2 teams with 5 players each', async () => {
    jest.setMock("../repository/players", {
        __esModule: true,
        retrieveLobbyPlayers: async (): Promise<Array<IPlayer>> => [{
            discordId: '1',
            blacklistedPlayerId: undefined,
            username: 'Player 1',
            globalName: 'Player 1',
            ratings: new Map(),
        },
        {
            discordId: '2',
            blacklistedPlayerId: undefined,
            username: 'Player 2',
            globalName: 'Player 2',
            ratings: new Map(),
        },
        {
            discordId: '3',
            blacklistedPlayerId: undefined,
            username: 'Player 3',
            globalName: 'Player 3',
            ratings: new Map().set('1', 3),
        },
        {
            discordId: '4',
            blacklistedPlayerId: undefined,
            username: 'Player 4',
            globalName: 'Player 4',
            ratings: new Map(),
        },
        {
            discordId: '5',
            blacklistedPlayerId: undefined,
            username: 'Player 5',
            globalName: 'Player 5',
            ratings: new Map().set('1', 3),
        },
        {
            discordId: '6',
            blacklistedPlayerId: undefined,
            username: 'Player 6',
            globalName: 'Player 6',
            ratings: new Map(),
        },
        {
            discordId: '7',
            blacklistedPlayerId: undefined,
            username: 'Player 7',
            globalName: 'Player 7',
            ratings: new Map(),
        },
        {
            discordId: '8',
            blacklistedPlayerId: undefined,
            username: 'Player 8',
            globalName: 'Player 8',
            ratings: new Map(),
        },
        {
            discordId: '9',
            blacklistedPlayerId: undefined,
            username: 'Player 9',
            globalName: 'Player 9',
            ratings: new Map(),
        },
        {
            discordId: '10',
            blacklistedPlayerId: undefined,
            username: 'Player 10',
            globalName: 'Player 10',
            ratings: new Map(),
        }
        ]
    });
    const { makeLobby } = require('../lobbyGenerator');
    const teams = await makeLobby(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    expect(teams.teamOne.length).toBe(5);
    expect(teams.teamTwo.length).toBe(5);
});

test('it should create teams balanced by rating', async () => {
    jest.setMock("../repository/players", {
        __esModule: true,
        retrieveLobbyPlayers: async (): Promise<Array<IPlayer>> => [{
            discordId: '1',
            blacklistedPlayerId: undefined,
            username: 'Player 1',
            globalName: 'Player 1',
            ratings: new Map().set('1',10),
        },
        {
            discordId: '2',
            blacklistedPlayerId: undefined,
            username: 'Player 2',
            globalName: 'Player 2',
            ratings: new Map().set('1', 10),
        },
        {
            discordId: '3',
            blacklistedPlayerId: undefined,
            username: 'Player 3',
            globalName: 'Player 3',
            ratings: new Map().set('1', 10),
        },
        {
            discordId: '4',
            blacklistedPlayerId: undefined,
            username: 'Player 4',
            globalName: 'Player 4',
            ratings: new Map().set('1', 10),
        },
        {
            discordId: '5',
            blacklistedPlayerId: undefined,
            username: 'Player 5',
            globalName: 'Player 5',
            ratings: new Map().set('1', 3),
        },
        {
            discordId: '6',
            blacklistedPlayerId: undefined,
            username: 'Player 6',
            globalName: 'Player 6',
            ratings: new Map(),
        },
        {
            discordId: '7',
            blacklistedPlayerId: undefined,
            username: 'Player 7',
            globalName: 'Player 7',
            ratings: new Map(),
        },
        {
            discordId: '8',
            blacklistedPlayerId: undefined,
            username: 'Player 8',
            globalName: 'Player 8',
            ratings: new Map(),
        },
        {
            discordId: '9',
            blacklistedPlayerId: undefined,
            username: 'Player 9',
            globalName: 'Player 9',
            ratings: new Map(),
        },
        {
            discordId: '10',
            blacklistedPlayerId: undefined,
            username: 'Player 10',
            globalName: 'Player 10',
            ratings: new Map(),
        }
        ]
    });
    const { makeLobby } = require('../lobbyGenerator');
    const teams = await makeLobby(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    expect(teams.teamOne.filter((player: any) => player.rating > 5).length).toBeLessThan(3);
    expect(teams.teamTwo.filter((player: any) => player.rating > 5).length).toBeLessThan(3);
});

// test('Sort accordingly when players have blacklisted players, but no matching in lobby', () => {

// });


// test('Sort accordingly when only one player has blacklisted matched player', () => {

// });
