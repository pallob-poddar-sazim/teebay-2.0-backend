import { Product } from "@/common/entities/products.entity";
import { Purchase } from "@/common/entities/purchases.entity";
import { User } from "@/common/entities/users.entity";
import { CustomSQLBaseRepository } from "@/common/repository/custom-sql-base.repository";
import { Injectable } from "@nestjs/common";
import { UUID } from "crypto";

@Injectable()
export class PurchasesRepository extends CustomSQLBaseRepository<Purchase> {
  findAllByUserId(userId: UUID) {
    return this.find(
      {
        $or: [{ buyer: userId }, { product: { seller: userId } }],
      },
      {
        populate: ["product.categories", "product.seller", "buyer"],
      },
    );
  }

  createOne(product: Product, buyer: User) {
    const purchase = new Purchase(product, buyer);

    this.em.persist(purchase);

    return purchase;
  }
}
