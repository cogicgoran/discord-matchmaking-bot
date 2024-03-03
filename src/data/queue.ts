import { ILobby } from '../interfaces';
import { MAX_PLAYERS_5V5 } from '../utils/constants';

// guildId map to guild queue
export const lobbies = new Map<string, { playersInMatch: number; queue: Array<string> }>();

export function addPlayerToQueue(guildId: string, playerId: string) {
  let lobby = lobbies.get(guildId);
  if (!lobby) {
    lobby = makeDefaultLobby();
    lobbies.set(guildId, lobby);
  }
  lobby.queue.push(playerId);
}

export function emptyQueue(guildId: string) {
  let lobby = lobbies.get(guildId)!;
  if (!lobby) {
    lobby = makeDefaultLobby();
    lobbies.set(guildId, lobby);
  }
  lobby.queue.splice(0);
}

export function getQueue(guildId: string) {
  let lobby = lobbies.get(guildId)!;
  if (!lobby) {
    lobby = makeDefaultLobby();
    lobbies.set(guildId, lobby);
  }
  return lobby.queue;
}

export function getLobby(guildId: string) {
  let lobby = lobbies.get(guildId)!;
  if (!lobby) {
    lobby = makeDefaultLobby();
    lobbies.set(guildId, lobby);
  }
  return lobby;
}

function makeDefaultLobby(): ILobby {
  return {
    playersInMatch: MAX_PLAYERS_5V5,
    queue: [],
  };
}
