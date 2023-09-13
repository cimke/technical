import { EntityRepository } from '@mikro-orm/core';

import { PlayerRepository } from '../../../domain/capabilities/player-repository';
import { PlayerNotFoundError } from '../../../domain/exceptions/player-not-found-error';
import { PlayerEntity } from '../entities/player';
import { databaseError } from '../utils/error';
import { Player } from './../../../domain/models/player';

export class PlayerRepositoryImpl extends EntityRepository<PlayerEntity> implements PlayerRepository {
  private transformToModel(player: PlayerEntity): Player {
    return {
      id: player.id,
      name: player.name,
    };
  }

  async getOneById(id: string): Promise<Player> {
    const player = await this.findOne({ id });

    if (!player) throw new PlayerNotFoundError();

    return this.transformToModel(player);
  }

  async createOne(name: string): Promise<Player> {
    const player = this.create(
      new PlayerEntity({
        name: name,
        teamId: 'uuid', // This might be your extra points ;)
      }),
    );
    this.getEntityManager().persist(player);

    await databaseError(async () => await this.getEntityManager().flush());

    return this.transformToModel(player);
  }

  async deleteOne(player: Player): Promise<void> {
    const playerRef = this.getEntityManager().getReference(PlayerEntity, player.id);
    await this.getEntityManager().remove(playerRef).flush();
  }
}
