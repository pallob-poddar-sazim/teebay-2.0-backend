import { handleSuccess, handleError } from '../utils/graphqlResponse';
import { ProductService } from './product.service';
import { UUID } from 'crypto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RentOption } from './product.entity';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query()
  async getAllProducts() {
    try {
      const products = await this.productService.getAllProducts();

      return handleSuccess('Successfully fetched products', products);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Query()
  async getProductsBySellerId(@Args('sellerId') sellerId: UUID) {
    try {
      const products =
        await this.productService.getProductsBySellerId(sellerId);

      return handleSuccess('Successfully fetched products', products);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Mutation()
  async createProduct(
    @Args('title') title: string,
    @Args('categoryIds') categoryIds: UUID[],
    @Args('description') description: string,
    @Args('price') price: number,
    @Args('rent') rent: number,
    @Args('rentOption') rentOption: RentOption,
    @Args('sellerId') sellerId: UUID,
  ) {
    try {
      const product = await this.productService.createProduct(
        title,
        categoryIds,
        description,
        price,
        rent,
        rentOption,
        sellerId,
      );

      return handleSuccess('Successfully created product', product);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Mutation()
  async updateProduct(
    @Args('id') id: UUID,
    @Args('title') title: string,
    @Args('categoryIds') categoryIds: UUID[],
    @Args('description') description: string,
    @Args('price') price: number,
    @Args('rent') rent: number,
    @Args('rentOption') rentOption: RentOption,
  ) {
    try {
      const product = await this.productService.updateProduct(
        id,
        title,
        categoryIds,
        description,
        price,
        rent,
        rentOption,
      );

      return handleSuccess('Successfully updated product', product);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Mutation()
  async deleteProduct(@Args('id') id: UUID) {
    try {
      const product = await this.productService.deleteProduct(id);

      return handleSuccess('Successfully deleted product', product);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }
}
