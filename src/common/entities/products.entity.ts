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
  EntityRepositoryType,
} from "@mikro-orm/core";
import { User } from "./users.entity";
import { Purchase } from "./purchases.entity";
import { Rental } from "./rentals.entity";
import { Category } from "./categories.entity";
import { ProductsRepository } from "@/modules/products/products.repository";
import { ERentOption } from "../enums/products.enums";
import { CustomBaseEntity } from "./custom-base.entity";

@Entity({
  tableName: "products",
  repository: () => ProductsRepository,
})
export class Product extends CustomBaseEntity {
  [EntityRepositoryType]?: ProductsRepository;
  constructor(
    title: string,
    description: string,
    price: number,
    rent: number,
    rentOption: ERentOption,
    seller: User,
    categories: Category[],
  ) {
    super();

    this.title = title;
    this.description = description;
    this.price = price;
    this.rent = rent;
    this.rentOption = rentOption;
    this.seller = seller;
    this.categories.set(categories);
  }
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property()
  title!: string;

  @Property({ columnType: "text" })
  description!: string;

  @Property({ type: "decimal" })
  price!: number;

  @Property({ type: "decimal" })
  rent!: number;

  @Enum(() => ERentOption)
  rentOption!: ERentOption;

  @ManyToOne(() => User)
  seller!: User;

  @ManyToMany(() => Category, (category) => category.products, { owner: true })
  categories = new Collection<Category>(this);

  @OneToOne(() => Purchase, (purchase) => purchase.product, { nullable: true })
  purchase?: Purchase;

  @OneToMany(() => Rental, (rental) => rental.product)
  rentals = new Collection<Rental>(this);
}
