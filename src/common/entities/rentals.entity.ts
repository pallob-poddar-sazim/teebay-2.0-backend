import { Entity, PrimaryKey, Property, ManyToOne, EntityRepositoryType } from "@mikro-orm/core";
import { User } from "./users.entity";
import { Product } from "./products.entity";
import { RentalsRepository } from "@/modules/rentals/rentals.repository";
import { CustomBaseEntity } from "./custom-base.entity";

@Entity({
  tableName: "rentals",
  repository: () => RentalsRepository,
})
export class Rental extends CustomBaseEntity {
  [EntityRepositoryType]?: RentalsRepository;
  constructor(
    rentStartDate: Date,
    rentEndDate: Date,
    product: Product,
    borrower: User,
  ) {
    super();
    
    this.rentStartDate = rentStartDate;
    this.rentEndDate = rentEndDate;
    this.product = product;
    this.borrower = borrower;
  }
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property()
  rentStartDate!: Date;

  @Property()
  rentEndDate!: Date;

  @ManyToOne(() => Product)
  product!: Product;

  @ManyToOne(() => User)
  borrower!: User;
}
