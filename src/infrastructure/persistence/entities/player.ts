import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

import { PlayerRepositoryImpl } from '../repositories/player';

@Entity({ customRepository: () => PlayerRepositoryImpl })
export class PlayerEntity {
  @PrimaryKey()
  readonly id: string;

  @Property()
  readonly name: string;

  @Property()
  readonly teamId: string;

  @Property()
  readonly createdAt: Date = new Date();

  @Property()
  readonly updatedAt: Date = new Date();

  constructor(props: Omit<PlayerEntity, 'id' | 'createdAt' | 'updatedAt'>) {
    this.id = v4();
    this.name = props.name;
    this.teamId = props.teamId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
