import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';

@Entity()
export class Rental {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @ManyToOne(() => Product)
  product!: Product;

  @ManyToOne(() => User)
  borrower!: User;

  @Property()
  rentStartDate!: Date;

  @Property()
  rentEndDate!: Date;

  @Property({ onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
