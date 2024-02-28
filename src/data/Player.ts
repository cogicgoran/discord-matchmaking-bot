import { IPlayer } from "../interfaces";

export class Player implements IPlayer {
    guildId: string;
    blacklistedPlayerId: string | undefined;
    discordId: string;
    globalName: string;
    rating: number;
    username: string;

    constructor(data : any) {
        this.guildId = data.guildId;
        this.blacklistedPlayerId = data.blacklistedPlayerId;
        this.discordId = data.discordId;
        this.globalName = data.globalName;
        this.username = data.username;
        this.rating = data.rating;
        this.validate(data);
    }

    validate(data: unknown){
        if(!this.guildId || !this.discordId || !this.username || !this.globalName) {
            console.log('[PlayerValidationError]:','Invalid player data. Received', data)
            throw new Error('Invalid player data. Received');
        } 
    }
}
