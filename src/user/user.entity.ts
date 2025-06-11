import {
  Entity,
  PrimaryKey,
  Property,
  Unique,
  // OneToMany,
  // Collection,
} from '@mikro-orm/core';
// import { Product } from './product.entity';
// import { Purchase } from './purchase.entity';
// import { Rental } from './rental.entity';

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

  // @OneToMany(() => Product, (product) => product.seller)
  // products = new Collection<Product>(this);

  // @OneToMany(() => Purchase, (purchase) => purchase.user)
  // purchases = new Collection<Purchase>(this);

  // @OneToMany(() => Rental, (rental) => rental.user)
  // rentals = new Collection<Rental>(this);
}
