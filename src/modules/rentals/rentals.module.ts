import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Rental } from "@/common/entities/rentals.entity";
import { User } from "@/common/entities/users.entity";
import { Product } from "@/common/entities/products.entity";
import { RentalsService } from "./rentals.service";
import { RentalsResolver } from "./rentals.resolver";

@Module({
  imports: [MikroOrmModule.forFeature([Rental, User, Product])],
  providers: [RentalsResolver, RentalsService],
})
export class RentalModule {}
