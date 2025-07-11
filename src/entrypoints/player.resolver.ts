import { Inject } from '@nestjs/common';
import { Args, Field, ID, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';

import { PlayerServiceImpl } from '../domain/services/manager';

@ObjectType()
export class Player {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;
}

@Resolver(() => Player)
export class PlayerResolver {
  constructor(
    @Inject(PlayerServiceImpl)
    private readonly playerService: PlayerServiceImpl,
  ) {}

  private handleError(error: unknown): never {
    if (error instanceof Error) {
      if (process.env.NODE_ENV === 'development') {
        throw new Error(`${error.message}\n${error.stack}`);
      }
      throw new Error(error.message);
    }
    throw new Error('Unknown error');
  }

  @Query(() => Player, { name: 'player' })
  async getPlayer(@Args('id', { type: () => ID }) id: string): Promise<Player> {
    try {
      return await this.playerService.getPlayer(id);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Mutation(() => Player)
  async createPlayer(@Args('name') name: string): Promise<Player> {
    try {
      return await this.playerService.createPlayer(name);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Mutation(() => Boolean)
  async deletePlayer(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    try {
      await this.playerService.deletePlayer(id);
      return true;
    } catch (error) {
      this.handleError(error);
    }
  }
}
