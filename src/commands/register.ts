import discord from 'discord.js';
import { IPlayer } from '../interfaces';
import { addPlayer } from '../repository/players';

export async function registerCommand(message: discord.Message<boolean>) {
    try {
        const player: IPlayer = {
            discordId: message.author.id,
            blacklistedPlayerId: undefined,
            username: message.author.username,
            globalName: message.author.globalName ?? message.author.username,
            ratings: new Map()
          }
          await addPlayer(player);
    } catch (error) {
        console.log('[ERROR: RegisterCommand]:', error);
    }
}
