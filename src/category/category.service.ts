import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Category } from './category.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    private readonly em: EntityManager,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    const categories = await this.categoryRepository.findAll();

    return categories;
  }

  async createCategories(names: string[]): Promise<Category[]> {
    const existingCategories = await this.categoryRepository.find({
      name: { $in: names },
    });
    const existingCategoryNames = new Set(
      existingCategories.map((c) => c.name),
    );

    const newCategories = names
      .filter((name) => !existingCategoryNames.has(name))
      .map((name) => this.categoryRepository.create({ name }));

    await this.em.persistAndFlush(newCategories);

    const categories = await this.categoryRepository.find({
      name: { $in: names },
    });

    return categories;
  }
}
