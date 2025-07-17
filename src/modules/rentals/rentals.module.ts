import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Rental } from "@/common/entities/rentals.entity";
import { User } from "@/common/entities/users.entity";
import { Product } from "@/common/entities/products.entity";
import { RentalsService } from "./rentals.service";
import { RentalResolver } from "./rentals.resolver";

@Module({
  imports: [MikroOrmModule.forFeature([Rental, User, Product])],
  providers: [RentalResolver, RentalsService],
})
export class RentalModule {}
