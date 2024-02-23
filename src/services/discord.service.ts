import { AuditLogEvent, Guild } from "discord.js";
import { registerChannel } from "../commands/channel";
import { client as discordClient } from '../discord-client/discord-client';

export async function handleGuildAvailableEvent(guild: Guild) {
    try {
        const audit_logs = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelCreate,
            user: discordClient.user!.id
        });
        const entries = audit_logs.entries;
        const entry = entries.first();
        if (!entry) {
            return;
        }
        const channel = await guild.channels.fetch(entry.targetId!);
        if (!channel) return;
        registerChannel(channel);
    } catch (error) {
        console.log('[RetrieveChannelError]:', error);
    }

}