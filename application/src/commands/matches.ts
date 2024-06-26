import discord from 'discord.js';
import { getMatch, setWinnerMatch } from '../repository/matches';
import { updateRatings } from '../services/player.service';

export async function setMatchResultCommand(message: discord.Message<boolean>) {
  try {
    const data = message.content.split(' ');
    // Example: "!match {matchId} winner A"
    if (data.length !== 4) {
      throw new Error(`Unexpected match command ${message.content}`);
    }
    const matchId = data[1];
    const matchResult = data[3];
    if (matchResult !== 'A' && matchResult !== 'B') {
      throw new Error(`Unexpected match result. Received '${matchResult}'`);
    }
    // TODO: validate object id?
    const matchData = await getMatch(matchId);
    if (!matchData) {
      throw new Error(`Match with id ${matchId} not found`);
    }
    if (matchData.winner !== null) {
      throw new Error('Match result already exists');
    }
    await setWinnerMatch(matchData, matchResult);
    updateRatings(matchData, matchResult);
  } catch (error) {
    console.log('[SetMatchResultCommand]:', error);
  }
}
