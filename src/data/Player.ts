import { IPlayer } from "../interfaces";

export class Player implements IPlayer {
    blacklistedPlayerId: string | undefined;
    discordId: string;
    globalName: string;
    ratings: Map<string, number>;
    username: string;
    constructor(data : any) {
        this.blacklistedPlayerId = data.blacklistedPlayerId;
        this.discordId = data.discordId;
        this.globalName = data.globalName;
        this.username = data.username;
        this.ratings = new Map(Object.entries(data.ratings));
        this.validate(data);
    }

    validate(data: unknown){
        if(!this.discordId || !this.username || !this.globalName) {
            console.log('[PlayerValidationError]:','Invalid player data. Received', data)
            throw new Error('Invalid player data. Received');
        } 
    }
}
