import { UUID } from 'crypto';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Product, RentOption } from './product.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { User } from 'src/user/user.entity';
import { Category } from 'src/category/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,

    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,

    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,

    private readonly em: EntityManager,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productRepository.find(
      {
        purchase: null,
        rentals: {
          id: null,
        },
      },
      {
        populate: ['seller', 'categories'],
      },
    );

    return products;
  }

  async getProductsBySellerId(sellerId: UUID): Promise<Product[]> {
    const user = await this.userRepository.findOne({ id: sellerId });
    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const products = await this.productRepository.find(
      {
        seller: sellerId,
        rentals: {
          id: null,
        },
        purchase: null,
      },
      {
        populate: ['seller', 'categories'],
      },
    );

    return products;
  }

  async createProduct(
    title: string,
    categoryIds: UUID[],
    description: string,
    price: number,
    rent: number,
    rentOption: RentOption,
    sellerId: UUID,
    em?: EntityManager,
  ): Promise<Product | null> {
    const emToUse = em ?? this.em;

    const userRepository = emToUse.getRepository(User);
    const productRepository = emToUse.getRepository(Product);

    const seller = await userRepository.findOne({ id: sellerId });
    if (!seller) {
      throw new GraphQLError('Seller not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const categories = categoryIds.map((id) =>
      emToUse.getReference(Category, id),
    );

    if (categories.length !== categoryIds.length) {
      throw new GraphQLError('One or more categories not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const product = productRepository.create({
      title,
      description,
      price,
      rent,
      rentOption,
      seller,
      categories,
    });

    await emToUse.persistAndFlush(product);

    const createdProduct = await productRepository.findOne(product.id, {
      populate: ['seller', 'categories'],
    });

    return createdProduct;
  }

  async updateProduct(
    id: UUID,
    title?: string,
    categoryIds?: UUID[],
    description?: string,
    price?: number,
    rent?: number,
    rentOption?: RentOption,
  ): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({ id: id });
    if (!existingProduct) {
      throw new GraphQLError('Product not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const product = await this.productRepository.findOneOrFail(
      { id },
      { populate: ['categories', 'seller'] },
    );

    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (rent) product.rent = rent;
    if (rentOption) product.rentOption = rentOption;

    if (categoryIds) {
      const categories = await this.categoryRepository.find({
        id: { $in: categoryIds },
      });
      product.categories.set(categories);
    } else {
      product.categories.removeAll();
    }

    await this.em.flush();

    return product;
  }

  async deleteProduct(id: UUID): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({ id: id });
    if (!existingProduct) {
      throw new GraphQLError('Product not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const product = await this.productRepository.findOneOrFail(
      { id },
      { populate: ['seller', 'categories'] },
    );

    await this.em.removeAndFlush(product);

    return product;
  }
}
