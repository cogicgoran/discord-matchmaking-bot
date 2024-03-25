import * as dotenv from 'dotenv';
dotenv.config();

export default {
  env: {
    DISCORD_BOT_TOKEN: process.env['DISCORD_BOT_TOKEN']!,
    MONGO_URI: process.env['MONGO_URI']!,
  },
};
