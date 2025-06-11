import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Category {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property()
  @Unique()
  name!: string;

  @Property({ onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
