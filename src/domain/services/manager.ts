import { PlayerRepository } from '../capabilities/player-repository';
import { PlayerService } from '../capabilities/player-service';
import { Player } from '../models/player';

export class PlayerServiceImpl implements PlayerService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async getPlayer(id: string): Promise<Player> {
    return await this.playerRepository.getOneById(id);
  }

  async createPlayer(name: string): Promise<Player> {
    return await this.playerRepository.createOne(name);
  }

  async deletePlayer(id: string): Promise<void> {
    const player = await this.getPlayer(id);

    return await this.playerRepository.deleteOne(player);
  }
}
