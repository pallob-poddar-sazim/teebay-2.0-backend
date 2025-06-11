import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from 'src/user/user.entity';
import { Product } from 'src/product/product.entity';

@Entity()
export class Purchase {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property({ onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @ManyToOne(() => User)
  buyer!: User;

  @ManyToOne(() => Product)
  product!: Product;
}
