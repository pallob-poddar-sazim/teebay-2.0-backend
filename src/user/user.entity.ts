import {
  Entity,
  PrimaryKey,
  Property,
  Unique,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { Product } from '../product/product.entity';
import { Purchase } from '../purchase/purchase.entity';
import { Rental } from '../rental/rental.entity';

@Entity()
export class User {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property()
  name!: string;

  @Property()
  @Unique()
  email!: string;

  @Property()
  phone!: string;

  @Property()
  address!: string;

  @Property()
  password!: string;

  @Property({ onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @OneToMany(() => Product, (product) => product.seller)
  products = new Collection<Product>(this);

  @OneToMany(() => Purchase, (purchase) => purchase.buyer)
  purchases = new Collection<Purchase>(this);

  @OneToMany(() => Rental, (rental) => rental.borrower)
  rentals = new Collection<Rental>(this);
}
