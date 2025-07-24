import { UUID } from "crypto";
import { GraphQLError } from "graphql/error";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Purchase } from "@/common/entities/purchases.entity";
import { EntityManager } from "@mikro-orm/postgresql";
import { User } from "@/common/entities/users.entity";
import { Product } from "@/common/entities/products.entity";
import { PurchasesRepository } from "./purchases.repository";
import { UsersRepository } from "../users/users.repository";
import { ProductsRepository } from "../products/products.repository";

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchasesRepository: PurchasesRepository,

    @InjectRepository(User)
    private readonly usersRepository: UsersRepository,

    @InjectRepository(Product)
    private readonly productsRepository: ProductsRepository,

    private readonly em: EntityManager,
  ) {}

  async getAllByUserId(userId: UUID): Promise<Purchase[]> {
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const purchases = await this.purchasesRepository.findAllByUserId(userId);

    return purchases;
  }

  async createOne(productId: UUID, buyerId: UUID): Promise<Purchase> {
    const product = await this.productsRepository.findOne({ id: productId });
    if (!product) {
      throw new GraphQLError("Product not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const buyer = await this.usersRepository.findOne({ id: buyerId });
    if (!buyer) {
      throw new GraphQLError("Buyer not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    if (product.seller.id === buyerId) {
      throw new GraphQLError("You cannot buy your own product", {
        extensions: { code: "FORBIDDEN" },
      });
    }

    const existingPurchase = await this.purchasesRepository.findOne({ product: productId });
    if (existingPurchase) {
      throw new GraphQLError("Product is already bought", {
        extensions: { code: "CONFLICT" },
      });
    }

    const purchase = this.purchasesRepository.createOne(product, buyer);

    await this.em.flush();

    await this.purchasesRepository.populate(purchase, [
      "product.seller",
      "product.categories",
      "buyer",
    ]);

    return purchase;
  }
}
