import { ShardingManager } from 'discord.js';
import { Request, Response, Router } from 'express';
import router from 'express-promise-router';

import { GetGuildsResponse } from '../models/cluster-api';
import { Controller } from './controller';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Config = require(`../config/config`);

export class GuildsController implements Controller {
	public path = `/guilds`;
	public router: Router = router();
	public authToken: string = Config.api.secret;

	constructor(private shardManager: ShardingManager) {}

	public register(): void {
		this.router.get(`/`, (req, res) => this.getGuilds(req, res));
	}

	private async getGuilds(_req: Request, res: Response): Promise<void> {
		const guilds: string[] = [
			...new Set((await this.shardManager.broadcastEval((client) => [...client.guilds.cache.keys()])).flat()),
		];

		const resBody: GetGuildsResponse = {
			guilds,
		};
		res.status(200).json(resBody);
	}
}
