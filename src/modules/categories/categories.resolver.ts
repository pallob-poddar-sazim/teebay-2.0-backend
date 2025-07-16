import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { handleSuccess, handleError } from '../../utils/graphqlResponse';
import { CategoriesService } from './categories.service';

@Resolver()
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query()
  async getAllCategories() {
    try {
      const categories = await this.categoriesService.getAll();

      return handleSuccess('Successfully fetched categories', categories);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Mutation()
  async createCategories(@Args('names') names: string[]) {
    try {
      const categories = await this.categoriesService.createMany(names);

      return handleSuccess('Successfully created categories', categories);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }
}
