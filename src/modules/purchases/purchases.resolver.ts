import { UUID } from "crypto";
import { handleError, handleSuccess } from "../../utils/graphql-response";
import { PurchasesService } from "./purchases.service";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

@Resolver()
export class PurchasesResolver {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Query()
  async getPurchasesByUserId(@Args("userId") userId: UUID) {
    try {
      const purchases = await this.purchasesService.getAllByUserId(userId);

      return handleSuccess("Successfully fetched purchases", purchases);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Mutation()
  async createPurchase(@Args("productId") productId: UUID, @Args("buyerId") buyerId: UUID) {
    try {
      const purchase = await this.purchasesService.createOne(productId, buyerId);

      return handleSuccess("Successfully bought the product", purchase);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }
}
