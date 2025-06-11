import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Product } from 'src/product/product.entity';

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

  @ManyToMany(() => Product, (product) => product.categories, { owner: true })
  products = new Collection<Product>(this);
}
