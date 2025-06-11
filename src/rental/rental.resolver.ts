import { UUID } from 'crypto';
import { RentalService } from './rental.service';
import { handleError, handleSuccess } from '../utils/graphqlResponse';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class RentalResolver {
  constructor(private readonly rentalService: RentalService) {}

  @Query()
  async getRentalsByUserId(@Args('userId') userId: UUID) {
    try {
      const rentals = await this.rentalService.getRentalsByUserId(userId);

      return handleSuccess('Successfully fetched rentals', rentals);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Mutation()
  async createRental(
    @Args('productId') productId: UUID,
    @Args('borrowerId') borrowerId: UUID,
    @Args('rentStartDate') rentStartDate: Date,
    @Args('rentEndDate') rentEndDate: Date,
  ) {
    try {
      const rental = await this.rentalService.createRental(
        productId,
        borrowerId,
        rentStartDate,
        rentEndDate,
      );

      return handleSuccess('Successfully rented the product', rental);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }
}
