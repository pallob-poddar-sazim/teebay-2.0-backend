import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core";
import { Product } from "./products.entity";
import { CategoriesRepository } from "@/modules/categories/categories.repository";
import { CustomBaseEntity } from "./custom-base.entity";

@Entity({
  tableName: "categories",
  repository: () => CategoriesRepository,
})
export class Category extends CustomBaseEntity {
  [EntityRepositoryType]?: CategoriesRepository;

  constructor(name: string) {
    super();

    this.name = name;
  }
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property()
  @Unique()
  name!: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products = new Collection<Product>(this);
}
