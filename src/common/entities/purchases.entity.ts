import { Entity, PrimaryKey, ManyToOne, OneToOne, EntityRepositoryType } from "@mikro-orm/core";
import { User } from "./users.entity";
import { Product } from "./products.entity";
import { PurchasesRepository } from "@/modules/purchases/purchases.repository";
import { CustomBaseEntity } from "./custom-base.entity";

@Entity({
  tableName: "purchases",
  repository: () => PurchasesRepository,
})
export class Purchase extends CustomBaseEntity {
  [EntityRepositoryType]?: PurchasesRepository;
  constructor(product: Product, buyer: User) {
    super();

    this.product = product;
    this.buyer = buyer;
  }
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @OneToOne(() => Product)
  product!: Product;

  @ManyToOne(() => User)
  buyer!: User;
}
