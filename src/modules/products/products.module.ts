import { Module } from "@nestjs/common";
import { Product } from "../../common/entities/products.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ProductsService } from "./products.service";
import { ProductsResolver } from "./products.resolver";
import { User } from "@/common/entities/users.entity";
import { Category } from "@/common/entities/categories.entity";
import { ProductConsumer } from "./products.worker";
import { FileModule } from "@/file/file.module";

@Module({
  imports: [MikroOrmModule.forFeature([Product, User, Category]), FileModule],
  providers: [ProductsResolver, ProductsService, ProductConsumer],
  exports: [MikroOrmModule.forFeature([Product])],
})
export class ProductsModule {}
