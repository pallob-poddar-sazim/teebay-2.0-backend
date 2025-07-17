import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Product } from "@/common/entities/products.entity";
import { User } from "@/common/entities/users.entity";
import { PurchasesResolver } from "./purchases.resolver";
import { PurchasesService } from "./purchases.service";
import { Purchase } from "@/common/entities/purchases.entity";

@Module({
  imports: [MikroOrmModule.forFeature([Purchase, User, Product])],
  providers: [PurchasesResolver, PurchasesService],
})
export class PurchasesModule {}
