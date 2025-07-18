import { Module } from "@nestjs/common";
import { Product } from "../../common/entities/products.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ProductsService } from "./products.service";
import { ProductsResolver } from "./products.resolver";
import { User } from "@/common/entities/users.entity";
import { Category } from "@/common/entities/categories.entity";
import { ProductConsumer } from "./products.worker";
import { FileUploadsModule } from "@/modules/file-uploads/file-uploads.module";

@Module({
  imports: [MikroOrmModule.forFeature([Product, User, Category]), FileUploadsModule],
  providers: [ProductsResolver, ProductsService, ProductConsumer],
  exports: [MikroOrmModule.forFeature([Product])],
})
export class ProductsModule {}
