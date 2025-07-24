import { UUID } from "crypto";
import { GraphQLError } from "graphql/error";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Product } from "../../common/entities/products.entity";
import { EntityManager } from "@mikro-orm/postgresql";
import { User } from "@/common/entities/users.entity";
import { Category } from "@/common/entities/categories.entity";
import { ProductsRepository } from "./products.repository";
import { UsersRepository } from "../users/users.repository";
import { CategoriesRepository } from "../categories/categories.repository";
import { ProductCreationDto, ProductUpdateDto } from "./products.dtos";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: ProductsRepository,

    @InjectRepository(User)
    private readonly usersRepository: UsersRepository,

    @InjectRepository(Category)
    private readonly categoriesRepository: CategoriesRepository,

    private readonly em: EntityManager,
  ) {}

  async getAllAvailable(): Promise<Product[]> {
    const products = await this.productsRepository.findAllAvailable();

    return products;
  }

  async getAllBySellerId(sellerId: UUID): Promise<Product[]> {
    const user = await this.usersRepository.findOne({ id: sellerId });
    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const products = await this.productsRepository.findAllBySellerId(sellerId);

    return products;
  }

  async createOne(
    productCreationDto: ProductCreationDto,
    em?: EntityManager,
  ): Promise<Product | null> {
    const entityManager = em || this.em;

    const usersRepository = entityManager.getRepository(User);
    const productsRepository = entityManager.getRepository(Product);

    const seller = await usersRepository.findOne({ id: productCreationDto.sellerId });
    if (!seller) {
      throw new GraphQLError("User not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const categories = productCreationDto.categoryIds.map((id) =>
      entityManager.getReference(Category, id),
    );
    if (categories.length !== productCreationDto.categoryIds.length) {
      throw new GraphQLError("One or more categories not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const product = productsRepository.createOne(productCreationDto, seller, categories);

    await entityManager.flush();

    await productsRepository.populate(product, ["seller", "categories"]);

    return product;
  }

  async updateOne(productUpdateDto: ProductUpdateDto): Promise<Product> {
    const product = await this.productsRepository.findOne(productUpdateDto.id, {
      populate: ["seller", "categories"],
    });
    if (!product) {
      throw new GraphQLError("Product not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const categories = await this.categoriesRepository.find({
      id: { $in: productUpdateDto.categoryIds },
    });
    if (categories.length !== productUpdateDto.categoryIds?.length) {
      throw new GraphQLError("One or more categories not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    this.productsRepository.updateOne(product, productUpdateDto, categories);

    await this.em.flush();

    return product;
  }

  async deleteOne(id: UUID): Promise<Product> {
    const product = await this.productsRepository.findOne(id, {
      populate: ["seller", "categories"],
    });
    if (!product) {
      throw new GraphQLError("Product not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    await this.em.removeAndFlush(product);

    return product;
  }
}
