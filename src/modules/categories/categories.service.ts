import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Category } from "@/common/entities/categories.entity";
import { EntityManager } from "@mikro-orm/postgresql";
import { CategoriesRepository } from "./categories.repository";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: CategoriesRepository,
    private readonly em: EntityManager,
  ) {}

  async getAll(): Promise<Category[]> {
    const categories = await this.categoriesRepository.findAll();

    return categories;
  }

  async createMany(names: string[]): Promise<Category[]> {
    const existingCategories = await this.categoriesRepository.find({
      name: { $in: names },
    });

    const existingCategoryNames = new Set(existingCategories.map((category) => category.name));
    const newCategoryNames = names.filter((name) => !existingCategoryNames.has(name));

    const categories = this.categoriesRepository.createMany(newCategoryNames);

    await this.em.flush();

    return categories;
  }
}
