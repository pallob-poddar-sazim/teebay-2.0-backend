import { Rental } from "@/common/entities/rentals.entity";
import { CustomSQLBaseRepository } from "@/common/repository/custom-sql-base.repository";
import { Injectable } from "@nestjs/common";
import { UUID } from "crypto";
import { RentalDto } from "./rentals.dtos";
import { Product } from "@/common/entities/products.entity";
import { User } from "@/common/entities/users.entity";

@Injectable()
export class RentalsRepository extends CustomSQLBaseRepository<Rental> {
  findAllByUserId(userId: UUID) {
    return this.find(
      {
        $or: [{ borrower: userId }, { product: { seller: userId } }],
      },
      {
        populate: ["product.categories", "product.seller", "borrower"],
      },
    );
  }

  createOne(rentalDto: RentalDto, product: Product, borrower: User) {
    const { rentStartDate, rentEndDate } = rentalDto;

    const rental = new Rental(rentStartDate, rentEndDate, product, borrower);

    this.em.persist(rental);

    return rental;
  }
}
