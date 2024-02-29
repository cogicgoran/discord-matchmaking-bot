import config from './config';
import { registerCommand } from './commands/register';
import { client as discordClient } from './discord-client/discord-client';
import { getLobbyCommand, matchmakingLimitCommand, queueCommand } from './commands/queue';
import { setMatchResultCommand } from './commands/matches';
import { createChannelCommand, initChannel, isBotChannel, removeChannel, removeGuild } from './commands/channel';
import { getTopRatedCommand } from './commands/players';
import { handleGuildAvailableEvent } from './services/discord.service';
import { retrieveLobbyPlayers } from './repository/players';

const ADMIN_USERNAME = 'aragok';

discordClient.on('ready', (client) => {
  console.log('[ClientReady]:', client.user.tag);
});

discordClient.on('guildCreate', (guild) => {
  initChannel(guild);
});

discordClient.on('guildAvailable', (guild) => {
  // Checks for channels built by bot and save it to memory
  handleGuildAvailableEvent(guild);
})

discordClient.on('guildDelete', (guild) => {
  removeGuild(guild.id);
});

// wrong type?
discordClient.on('channelDelete', (channel: any) => {
  removeChannel(channel);
})

discordClient.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (message.content === '!MM_INIT' && message.author.username === ADMIN_USERNAME) {
    createChannelCommand(message);
    return;
  }
  if (!isBotChannel(message)) return;
  if (message.content === '!help') {
    message.reply(`\`!r\` - Register yourself as a player\n\`!q\` - Queue into matchmaking lobby\n\`!lobby\` - List all players in a lobby\n\`!top10\` - List top 10 players with ratings`)
    return;
  }
  if (['!r', '!reg', '!register'].includes(message.content)) {
    registerCommand(message);
    return;
  }
  if (['!q', '!queue'].includes(message.content)) {
    queueCommand(message);
    return;
  }
  if (message.content === '!mm2' && message.author.username === ADMIN_USERNAME) {
    matchmakingLimitCommand(message.guildId!, 2);
    return;
  }
  if (message.content === '!mm10' && message.author.username === ADMIN_USERNAME) {
    matchmakingLimitCommand(message.guildId!, 10);
    return;
  }
  if (message.content === '!lobby') {
    getLobbyCommand(message);
    return;
  }
  // if (message.content === '!blacklist') {
  //   getBlacklistCommand(message);
  //   return;
  // }
  if (message.content === '!top10') {
    getTopRatedCommand(message);
    return;
  }
  // if (message.content.startsWith('!blacklist')) {
  //   blacklistCommand(message);
  //   return;
  // }
  if (message.content.startsWith("!match")) {
    setMatchResultCommand(message);
    return
  }
});

discordClient.login(config.env['DISCORD_BOT_TOKEN']);
