import { ApplicationCommandData, CommandInteraction, Message, PermissionString } from 'discord.js';
import { EventData } from '../models/internal-models';

export interface Command {
	adminOnly?: boolean;
	requireSetup?: boolean;
	name: string;
    aliases?: string[];
	metadata: ApplicationCommandData;
	ownerOnly?: boolean;
	guildOnly?: boolean;
	requireDev: boolean;
	requireGuild: boolean;
	requireClientPerms: PermissionString[];
	requireUserPerms: PermissionString[];
	requirePremium: boolean;
	executeIntr(intr: CommandInteraction, data?: EventData): Promise<void>;
	executeMsgCmd(msg: Message, args?: string[], data?: EventData): Promise<void>;
}
