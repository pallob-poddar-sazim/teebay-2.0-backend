import { UUID } from "crypto";
import { GraphQLError } from "graphql/error";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Rental } from "@/common/entities/rentals.entity";
import { EntityManager } from "@mikro-orm/postgresql";
import { User } from "@/common/entities/users.entity";
import { Product } from "@/common/entities/products.entity";
import { RentalsRepository } from "./rentals.repository";
import { UsersRepository } from "../users/users.repository";
import { ProductsRepository } from "../products/products.repository";
import { RentalDto } from "./rentals.dtos";

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalsRepository: RentalsRepository,

    @InjectRepository(User)
    private readonly usersRepository: UsersRepository,

    @InjectRepository(Product)
    private readonly productsRepository: ProductsRepository,

    private readonly em: EntityManager,
  ) {}

  async getAllByUserId(userId: UUID): Promise<Rental[]> {
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const rentals = await this.rentalsRepository.findAllByUserId(userId);

    return rentals;
  }

  async createOne(rentalDto: RentalDto): Promise<Rental> {
    const product = await this.productsRepository.findOne({ id: rentalDto.productId });
    if (!product) {
      throw new GraphQLError("Product not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const borrower = await this.usersRepository.findOne({ id: rentalDto.borrowerId });
    if (!borrower) {
      throw new GraphQLError("User not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const existingRental = await this.rentalsRepository.findOne({
      id: rentalDto.productId,
    });
    if (existingRental) {
      throw new GraphQLError("Product is already rented", {
        extensions: { code: "CONFLICT" },
      });
    }

    const rental = this.rentalsRepository.createOne(rentalDto, product, borrower);

    await this.em.flush();

    await this.rentalsRepository.populate(rental, [
      "product.categories",
      "product.seller",
      "borrower",
    ]);

    return rental;
  }
}
