import { Category } from "@/common/entities/categories.entity";
import { CustomSQLBaseRepository } from "@/common/repository/custom-sql-base.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoriesRepository extends CustomSQLBaseRepository<Category> {
  createMany(names: string[]) {
    const categories = names.map((name) => new Category(name));

    this.em.persist(categories);

    return categories;
  }
}
