import * as dotenv from 'dotenv';
import { MAX_PLAYERS_5V5 } from './utils/constants';
dotenv.config();

export default {
  env: {
    DISCORD_BOT_TOKEN: process.env['DISCORD_BOT_TOKEN']!,
    MONGO_URI: process.env['MONGO_URI']!,
  },
  MAX_PLAYERS_IN_LOBBY: MAX_PLAYERS_5V5,
  setMatchmakingLimit(newLimit: 2 | 10){
    this.MAX_PLAYERS_IN_LOBBY = newLimit
  }
}