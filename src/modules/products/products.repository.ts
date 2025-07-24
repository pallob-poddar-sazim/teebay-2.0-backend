import { Product } from "@/common/entities/products.entity";
import { CustomSQLBaseRepository } from "@/common/repository/custom-sql-base.repository";
import { Injectable } from "@nestjs/common";
import { UUID } from "crypto";
import { ProductCreationDto, ProductUpdateDto } from "./products.dtos";
import { User } from "@/common/entities/users.entity";
import { Category } from "@/common/entities/categories.entity";

@Injectable()
export class ProductsRepository extends CustomSQLBaseRepository<Product> {
  findAllAvailable() {
    return this.find(
      {
        purchase: null,
        rentals: {
          id: null,
        },
      },
      {
        populate: ["seller", "categories"],
      },
    );
  }

  findAllBySellerId(sellerId: UUID) {
    return this.find(
      {
        seller: sellerId,
        purchase: null,
        rentals: {
          id: null,
        },
      },
      {
        populate: ["seller", "categories"],
      },
    );
  }

  createOne(productDto: ProductCreationDto, seller: User, categories: Category[]) {
    const { title, description, price, rent, rentOption } = productDto;

    const product = new Product(title, description, price, rent, rentOption, seller, categories);

    this.em.persist(product);

    return product;
  }

  updateOne(product: Product, productUpdateDto: ProductUpdateDto, categories: Category[]) {
    const { id, categoryIds, ...rest } = productUpdateDto;

    const cleaned = Object.fromEntries(
      Object.entries(rest).filter(([_, value]) => value !== undefined),
    );

    this.em.assign(product, { ...cleaned, categories });
    this.em.persist(product);

    return product;
  }
}
