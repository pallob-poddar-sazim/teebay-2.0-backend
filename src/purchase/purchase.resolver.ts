import { UUID } from 'crypto';
import { handleError, handleSuccess } from '../utils/graphqlResponse';
import { PurchaseService } from './purchase.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class PurchaseResolver {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Query()
  async getPurchasesByUserId(@Args('userId') userId: UUID) {
    try {
      const purchases = await this.purchaseService.getPurchasesByUserId(userId);

      return handleSuccess('Successfully fetched purchases', purchases);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Mutation()
  async createPurchase(
    @Args('productId') productId: UUID,
    @Args('buyerId') buyerId: UUID,
  ) {
    try {
      const purchase = await this.purchaseService.createPurchase(
        productId,
        buyerId,
      );

      return handleSuccess('Successfully bought the product', purchase);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }
}
