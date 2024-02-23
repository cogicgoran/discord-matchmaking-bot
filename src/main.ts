import config from './config';
import { registerCommand } from './commands/register';
import { client as discordClient } from './discord-client/discord-client';
import { blacklistCommand, getBlacklistCommand } from './commands/blacklist';
import { getLobbyCommand, matchmakingLimitCommand, queueCommand } from './commands/queue';
import { setMatchResultCommand } from './commands/matches';
import { createChannelCommand, initChannel, isBotChannel, removeChannel } from './commands/channel';

const ADMIN_USERNAME = 'aragok';

discordClient.on('ready', (client) => {
  console.log('[ClientReady]:', client.user.tag);
});

discordClient.on('guildCreate', (guild) => {
  initChannel(guild);
});

discordClient.on('guildDelete', (guild) => {
  removeChannel(guild.id);
});

// wrong type?
discordClient.on('channelDelete', (channel: any) => {
  removeChannel(channel?.id);
})

discordClient.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (message.content === '!MM_INIT') {
    createChannelCommand(message);
    return;
  }
  if (!isBotChannel(message)) return;
  if (message.content === '!help') {
    message.reply(`\`!r\` - Register yourself as a player\n\`!q\` - Queue into matchmaking lobby\n\`!lobby\` - List all players in a lobby`)    
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
    matchmakingLimitCommand(2);
    return;
  }
  if (message.content === '!mm10' && message.author.username === ADMIN_USERNAME) {
    matchmakingLimitCommand(10);
    return;
  }
  if (message.content === '!lobby') {
    getLobbyCommand(message);
    return;
  }
  if (message.content === '!blacklist') {
    getBlacklistCommand(message);
    return;
  }
  if (message.content.startsWith('!blacklist')) {
    blacklistCommand(message);
    return;
  }
  if (message.content.startsWith("!match")) {
    setMatchResultCommand(message);
    return
  }
});

discordClient.login(config.env['DISCORD_BOT_TOKEN']);
