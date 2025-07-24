import { UUID } from "crypto";
import { RentalsService } from "./rentals.service";
import { handleError, handleSuccess } from "@/utils/graphqlResponse";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

@Resolver()
export class RentalsResolver {
  constructor(private readonly rentalService: RentalsService) {}

  @Query()
  async getRentalsByUserId(@Args("userId") userId: UUID) {
    try {
      const rentals = await this.rentalService.getAllByUserId(userId);

      return handleSuccess("Successfully fetched rentals", rentals);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Mutation()
  async createRental(
    @Args("rentStartDate") rentStartDate: Date,
    @Args("rentEndDate") rentEndDate: Date,
    @Args("productId") productId: UUID,
    @Args("borrowerId") borrowerId: UUID,
  ) {
    try {
      const rental = await this.rentalService.createOne({
        rentStartDate,
        rentEndDate,
        productId,
        borrowerId,
      });

      return handleSuccess("Successfully rented the product", rental);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }
}
