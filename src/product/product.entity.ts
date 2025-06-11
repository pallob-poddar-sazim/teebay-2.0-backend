import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToOne,
  OneToMany,
  ManyToMany,
  Collection,
  Enum,
} from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { Purchase } from '../purchase/purchase.entity';
import { Rental } from '../rental/rental.entity';
import { Category } from '../category/category.entity';

export enum RentOption {
  HR = 'hr',
  DAY = 'day',
}

@Entity()
export class Product {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property()
  title!: string;

  @Property()
  description!: string;

  @Property({ type: 'decimal' })
  price!: number;

  @Property({ type: 'decimal' })
  rent!: number;

  @Enum(() => RentOption)
  rentOption!: RentOption;

  @Property({ onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @ManyToOne(() => User)
  seller!: User;

  @ManyToMany(() => Category, (category) => category.products)
  categories = new Collection<Category>(this);

  @OneToOne(() => Purchase, (purchase) => purchase.product, { nullable: true })
  purchase?: Purchase;

  @OneToMany(() => Rental, (rental) => rental.product)
  rentals = new Collection<Rental>(this);
}
