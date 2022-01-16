/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as dotenv from 'dotenv';
dotenv.config();

export default {
	"developers": [`232584569289703424`],
	"client": {
		"id": process.env.botId,
		"token": process.env.botToken,
		"intents": [`GUILDS`, `GUILD_MESSAGES`, `GUILD_MESSAGE_REACTIONS`, `DIRECT_MESSAGES`, `DIRECT_MESSAGE_REACTIONS`],
		"partials": [`MESSAGE`, `CHANNEL`, `REACTION`],
		"caches": {
			"BaseGuildEmojiManager": 0,
			"GuildBanManager": 0,
			"GuildInviteManager": 0,
			"GuildStickerManager": 0,
			"MessageManager": 0,
			"PresenceManager": 0,
			"StageInstanceManager": 0,
			"ThreadManager": 0,
			"ThreadMemberManager": 0,
			"VoiceStateManager": 0
		}
	},
	"api": {
		"port": 8080,
		"secret": `00000000-0000-0000-0000-000000000000`
	},
	"sharding": {
		"spawnDelay": 5,
		"spawnTimeout": 300,
		"serversPerShard": 1000
	},
	"clustering": {
		"enabled": false,
		"shardCount": 16,
		"callbackUrl": `http://localhost:8080/`,
		"masterApi": {
			"url": `http://localhost:5000/`,
			"token": `00000000-0000-0000-0000-000000000000`
		}
	},
	"jobs": {
		"updateServerCount": {
			"schedule": `0 */10 * * * *`,
			"log": false
		}
	},
	"rateLimiting": {
		"commands": {
			"amount": 10,
			"interval": 30
		},
		"triggers": {
			"amount": 10,
			"interval": 30
		},
		"reactions": {
			"amount": 10,
			"interval": 30
		}
	},
	"logging": {
		"pretty": true,
		"rateLimit": {
			"minTimeout": 30
		}
	}
};
