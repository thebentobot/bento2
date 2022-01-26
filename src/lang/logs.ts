export const logs = {
	info: {
		appStarted: `Application started.`,
		apiStarted: `API started on port {PORT}.`,
		commandsRegistering: `Registering commands: {COMMAND_NAMES}.`,
		commandsRegistered: `Commands registered.`,
		managerSpawningShards: `Spawning {SHARD_COUNT} shards: [{SHARD_LIST}].`,
		managerLaunchedShard: `Launched Shard {SHARD_ID}.`,
		managerAllShardsSpawned: `All shards have been spawned.`,
		clientLogin: `Client logged in as '{USER_TAG}'.`,
		clientReady: `Client is ready!`,
		jobScheduled: `Scheduled job '{JOB}' for '{SCHEDULE}'.`,
		jobRun: `Running job '{JOB}'.`,
		jobCompleted: `Job '{JOB}' completed.`,
		updatedServerCount: `Updated server count. Connected to {SERVER_COUNT} total servers.`,
		updatedServerCountSite: `Updated server count on '{BOT_SITE}'.`,
		guildJoined: `Guild '{GUILD_NAME}' ({GUILD_ID}) joined.`,
		guildLeft: `Guild '{GUILD_NAME}' ({GUILD_ID}) left.`
	},
	warn: {
		managerNoShards: `No shards to spawn.`
	},
	error: {
		unspecified: `An unspecified error ocurred.`,
		unhandledRejection: `An unhandled promise rejection ocurred.`,
		retrieveShards: `An error occurred while retrieving which shards to spawn.`,
		managerSpawningShards: `An error occurred while spawning shards.`,
		managerShardInfo: `An error occurred while retrieving shard info.`,
		commandsRegistering: `An error occurred while registering commands.`,
		clientLogin: `An error occurred while the client attempted to login.`,
		job: `An error occurred while running the '{JOB}' job.`,
		updatedServerCountSite: `An error occurred while updating the server count on '{BOT_SITE}'.`,
		guildJoin: `An error occurred while processing a guild join.`,
		guildLeave: `An error occurred while processing a guild leave.`,
		guildMemberAdd: `An error occurred while processing a guildMember add.`,
		guildMemberRemove: `An error occurred while processing a guildMember remove.`,
		message: `An error occurred while processing a message.`,
		reaction: `An error occurred while processing a reaction.`,
		command: `An error occurred while processing a command interaction.`,
		button: `An error occurred while processing a button interaction.`,
		commandNotFound: `[{INTERACTION_ID}] A command with the name '{COMMAND_NAME}' could not be found.`,
		commandGuild: `[{INTERACTION_ID}] An error occurred while executing the '{COMMAND_NAME}' command for user '{USER_TAG}' ({USER_ID}) in channel '{CHANNEL_NAME}' ({CHANNEL_ID}) in guild '{GUILD_NAME}' ({GUILD_ID}).`,
		commandOther: `[{INTERACTION_ID}] An error occurred while executing the '{COMMAND_NAME}' command for user '{USER_TAG}' ({USER_ID}).`,
		apiRequest: `An error occurred while processing a '{HTTP_METHOD}' request to '{URL}'.`,
		apiRateLimit: `A rate limit was hit while making a request.`
	}
};