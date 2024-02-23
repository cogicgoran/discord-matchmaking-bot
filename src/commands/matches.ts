import discord from 'discord.js';
import { getMatch, setWinnerMatch } from '../repository/matches';
import { updateRatings } from '../services/player.service';

export async function setMatchResultCommand(message: discord.Message<boolean>){
    try {
        const data = message.content.split(" ");
        // match id winner 1/2
        if(data.length !== 4) {
            console.log('E1');
            throw new Error(`Unexpected match command ${message.content}`);
        }
        const matchId = data[1];
        const matchResult = data[3];
        if(matchResult !== 'A' && matchResult !== 'B') {
            console.log('E2');
            throw new Error(`Unexpected match result. Received '${matchResult}'`)
        }
        // TODO: validate object id?
        const matchData = await getMatch(matchId);
        if(!matchData) {
            console.log('E3');
            throw new Error(`Match with id ${matchId} not found`);
        }
        if(matchData.winner !== null) {
            console.log('E4');
            throw new Error("Match result already exists");
        }
        await setWinnerMatch(matchData, matchResult);
        updateRatings(matchData as any, matchResult);
    } catch (error) {
        console.log('[SetMatchResultCommand]:', error);
    }
}