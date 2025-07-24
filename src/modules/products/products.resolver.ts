import { handleSuccess, handleError } from "../../utils/graphqlResponse";
import { ProductsService } from "./products.service";
import { UUID } from "crypto";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ERentOption } from "@/common/enums/products.enums";

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query()
  async getAllProducts() {
    try {
      const products = await this.productsService.getAllAvailable();

      return handleSuccess("Successfully fetched products", products);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Query()
  async getProductsBySellerId(@Args("sellerId") sellerId: UUID) {
    try {
      const products = await this.productsService.getAllBySellerId(sellerId);

      return handleSuccess("Successfully fetched products", products);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Mutation()
  async createProduct(
    @Args("title") title: string,
    @Args("categoryIds") categoryIds: UUID[],
    @Args("description") description: string,
    @Args("price") price: number,
    @Args("rent") rent: number,
    @Args("rentOption") rentOption: ERentOption,
    @Args("sellerId") sellerId: UUID,
  ) {
    try {
      const product = await this.productsService.createOne({
        title,
        categoryIds,
        description,
        price,
        rent,
        rentOption,
        sellerId,
      });

      return handleSuccess("Successfully created product", product);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Mutation()
  async updateProduct(
    @Args("id") id: UUID,
    @Args("title") title: string,
    @Args("categoryIds") categoryIds: UUID[],
    @Args("description") description: string,
    @Args("price") price: number,
    @Args("rent") rent: number,
    @Args("rentOption") rentOption: ERentOption,
  ) {
    try {
      const product = await this.productsService.updateOne({
        id,
        title,
        categoryIds,
        description,
        price,
        rent,
        rentOption,
      });

      return handleSuccess("Successfully updated product", product);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Mutation()
  async deleteProduct(@Args("id") id: UUID) {
    try {
      const product = await this.productsService.deleteOne(id);

      return handleSuccess("Successfully deleted product", product);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }
}
