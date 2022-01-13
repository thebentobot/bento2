import { CommandInteraction, MessageEmbed, NewsChannel, TextChannel, ThreadChannel, Message, GuildMember, Permissions } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { EventHandler } from '.';
import { Command } from '../commands';
import { EventData } from '../models/internal-models';
import { Logger } from '../services';
import { CommandUtils, MessageUtils, PermissionUtils } from '../utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Config = require(`../../config/config.json`);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Logs = require(`../../lang/logs.json`);

export class CommandHandler implements EventHandler {
	private rateLimiter = new RateLimiter(
		Config.rateLimiting.commands.amount,
		Config.rateLimiting.commands.interval * 1000,
	);

	constructor(private prefix: string, private helpCommand: Command, public commands: Command[]) {}

	public shouldHandle(msg: Message, args: string[]): boolean {
		return (
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			[this.prefix, `<@${msg.client.user!.id}>`, `<@!${msg.client.user!.id}>`].includes(
				args[0].toLowerCase()
			) && !msg.author.bot
		);
	}

	public async processMessage(msg: Message, args: string[]): Promise<void> {
		const limited = this.rateLimiter.take(msg.author.id);
		if (limited) {
			return;
		}

		// TODO: Get data from database
		const data = new EventData();

		// Check if I have permission to send a message
		if (!PermissionUtils.canSend(msg.channel)) {
			// No permission to send message
			if (PermissionUtils.canSend(msg.channel)) {
				const message = `I don't have all permissions required to send messages here!\nPlease allow me to **View Channel**, **Send Messages**, and **Embed Links** in this channel.`;
				await MessageUtils.send(msg.channel, message);
			}
			return;
		}

		// If only a prefix, run the help command
		if (args.length === 1) {
			await this.helpCommand.executeMsgCmd(msg, args, data);
		}

		// Try to find the command the user wants
		const command = this.find(args[1]);

		if (!command) {
			await this.helpCommand.executeMsgCmd(msg, args, data);
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		if (command!.requireDev && !Config.developers.includes(msg.author.id)) {
			await MessageUtils.send(msg.channel, `This command can only be used by developers.`);
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		if (msg.member && !this.hasPermission(msg.member, command!)) {
			await MessageUtils.send(msg.channel, `You don't have permission to run that command!`);
			return;
		}

		try {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await command!.executeMsgCmd(msg, args, data);
		} catch (error) {
			try {
				await MessageUtils.send(msg.channel, new MessageEmbed().setDescription(`Something went wrong!`).setColor(`#ff4a4a`).addField(`Error code`, `${error}`).addField(`Contact support`, `[Support Server](https://discord.gg/dd68WwP)`));
			// eslint-disable-next-line no-empty
			} catch {
				// empty eh
			}

			Logger.error(
				msg.channel instanceof TextChannel ||
					msg.channel instanceof NewsChannel ||
					msg.channel instanceof ThreadChannel ? Logs.error.commandGuild
						.replaceAll(`{MESSAGE_ID}`, msg.id)
						.replaceAll(`{COMMAND_NAME}`, command?.name)
						.replaceAll(`{USER_TAG}`, msg.author.tag)
						.replaceAll(`{USER_ID}`, msg.author.id)
						.replaceAll(`{CHANNEL_NAME}`, msg.channel.name)
						.replaceAll(`{CHANNEL_ID}`, msg.channel.id)
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						.replaceAll(`{GUILD_NAME}`, msg.guild!.name)
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						.replaceAll(`{GUILD_ID}`, msg.guild!.id)
					:
					Logs.error.commandOther
						.replaceAll(`{MESSAGE_ID}`, msg.id)
						.replaceAll(`{COMMAND_KEYWORD}`, command?.aliases?.join(`, `))
						.replaceAll(`{USER_TAG}`, msg.author.tag)
						.replaceAll(`{USER_ID}`, msg.author.id),
				error
			);
		}
	}

	private find(input: string): Command | undefined {
		input = input.toLowerCase();
		return (
			this.commands.find(command => command.name === input) ??
			this.commands.find(command => command.aliases?.includes(input))
		);	
	}

	private hasPermission(member: GuildMember, command: Command): boolean {
		// Developers and members with "Manage Server" have permission for all commands
		if (
			member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) ||
            Config.developers.includes(member.id)
		) {
			return true;
		}
		// Check if member has required permissions for command
		if (!member.permissions.has(command.requireUserPerms)) {
			return false;
		}
		return true;
	}

	public async processIntr(intr: CommandInteraction): Promise<void> {
		// Check if user is rate limited
		const limited = this.rateLimiter.take(intr.user.id);
		if (limited) {
			return;
		}

		// Defer interaction
		// NOTE: Anything after this point we should be responding to the interaction
		await intr.deferReply();

		// TODO: Get data from database
		const data = new EventData();

		// Try to find the command the user wants
		const command = this.commands.find((command) => command.metadata.name === intr.commandName);
		if (!command) {
			await this.sendIntrError(intr, data);
			Logger.error(
				Logs.error.commandNotFound
					.replaceAll(`{INTERACTION_ID}`, intr.id)
					.replaceAll(`{COMMAND_NAME}`, intr.commandName),
			);
			return;
		}

		try {
			// Check if interaction passes command checks
			const passesChecks = await CommandUtils.runChecks(command, intr, data);
			if (passesChecks) {
				// Execute the command
				await command.executeIntr(intr, data);
			}
		} catch (error) {
			await this.sendIntrError(intr, data);

			// Log command error
			Logger.error(
				intr.channel instanceof TextChannel ||
					intr.channel instanceof NewsChannel ||
					intr.channel instanceof ThreadChannel
					? Logs.error.commandGuild
						.replaceAll(`{INTERACTION_ID}`, intr.id)
						.replaceAll(`{COMMAND_NAME}`, command.metadata.name)
						.replaceAll(`{USER_TAG}`, intr.user.tag)
						.replaceAll(`{USER_ID}`, intr.user.id)
						.replaceAll(`{CHANNEL_NAME}`, intr.channel.name)
						.replaceAll(`{CHANNEL_ID}`, intr.channel.id)
						.replaceAll(`{GUILD_NAME}`, intr.guild?.name)
						.replaceAll(`{GUILD_ID}`, intr.guild?.id)
					: Logs.error.commandOther
						.replaceAll(`{INTERACTION_ID}`, intr.id)
						.replaceAll(`{COMMAND_NAME}`, command.metadata.name)
						.replaceAll(`{USER_TAG}`, intr.user.tag)
						.replaceAll(`{USER_ID}`, intr.user.id),
				error,
			);
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private async sendIntrError(intr: CommandInteraction, _data: EventData): Promise<void> {
		try {
			const embed = new MessageEmbed()
				.setDescription(`Something went wrong!`)
				.addField(`Error code`, intr.id)
				.addField(`Contact support`, `[Support Server](https://discord.gg/dd68WwP)`)
				.setColor(`#ff4a4a`);
			await MessageUtils.sendIntr(
				intr,
				embed,
			);
		} catch {
			// Ignore
		}
	}
}
