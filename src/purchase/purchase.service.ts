import { UUID } from 'crypto';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Purchase } from './purchase.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { User } from 'src/user/user.entity';
import { Product } from 'src/product/product.entity';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: EntityRepository<Purchase>,

    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,

    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,

    private readonly em: EntityManager,
  ) {}

  async getPurchasesByUserId(userId: UUID): Promise<Purchase[]> {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const purchases = await this.purchaseRepository.find(
      {
        $or: [{ buyer: userId }, { product: { seller: userId } }],
      },
      {
        populate: ['product.categories', 'product.seller', 'buyer'],
      },
    );

    return purchases;
  }

  async createPurchase(productId: UUID, buyerId: UUID): Promise<Purchase> {
    const product = await this.productRepository.findOne({ id: productId });
    if (!product) {
      throw new GraphQLError('Product not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const buyer = await this.userRepository.findOne({ id: buyerId });
    if (!buyer) {
      throw new GraphQLError('Buyer not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const existingPurchase = await this.purchaseRepository.findOne(
      { product: productId },
      {
        populate: ['product.categories', 'product.seller', 'buyer'],
      },
    );

    if (existingPurchase) {
      throw new GraphQLError('Product is already bought', {
        extensions: { code: 'CONFLICT' },
      });
    }

    const purchase = this.purchaseRepository.create({
      product,
      buyer,
    });

    await this.em.persistAndFlush(purchase);

    const createdPurchase = await this.purchaseRepository.populate(purchase, [
      'product.seller',
      'product.categories',
      'buyer',
    ]);

    return createdPurchase;
  }
}
