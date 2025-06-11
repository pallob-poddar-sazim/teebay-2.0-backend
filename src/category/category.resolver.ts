import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { handleSuccess, handleError } from '../utils/graphqlResponse';
import { CategoryService } from './category.service';

@Resolver()
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query()
  async getAllCategories() {
    try {
      const categories = await this.categoryService.getAllCategories();

      return handleSuccess('Successfully fetched categories', categories);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Mutation()
  async createCategories(@Args('names') names: string[]) {
    try {
      const categories = await this.categoryService.createCategories(names);

      return handleSuccess('Successfully created categories', categories);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }
}
