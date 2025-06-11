import { UUID } from 'crypto';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Rental } from './rental.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { User } from 'src/user/user.entity';
import { Product } from 'src/product/product.entity';

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepository: EntityRepository<Rental>,

    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,

    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,

    private readonly em: EntityManager,
  ) {}

  async getRentalsByUserId(userId: UUID): Promise<Rental[]> {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const rentals = await this.rentalRepository.find(
      {
        $or: [{ borrower: userId }, { product: { seller: userId } }],
      },
      {
        populate: ['product.categories', 'product.seller', 'borrower'],
      },
    );

    return rentals;
  }

  async createRental(
    productId: UUID,
    borrowerId: UUID,
    rentStartDate: Date,
    rentEndDate: Date,
  ): Promise<Rental> {
    const product = await this.productRepository.findOne({ id: productId });
    if (!product) {
      throw new GraphQLError('Product not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const user = await this.userRepository.findOne({ id: borrowerId });
    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const existingRental = await this.rentalRepository.findOne({
      id: productId,
    });
    if (existingRental) {
      throw new GraphQLError('Product is already rented', {
        extensions: { code: 'CONFLICT' },
      });
    }

    const rental = this.rentalRepository.create({
      product: productId,
      borrower: borrowerId,
      rentStartDate,
      rentEndDate,
    });

    await this.em.persistAndFlush(rental);

    await this.rentalRepository.populate(rental, [
      'product.categories',
      'product.seller',
      'borrower',
    ]);

    return rental;
  }
}
