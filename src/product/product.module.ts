import { Module } from '@nestjs/common';
import { Product } from './product.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { User } from 'src/user/user.entity';
import { Category } from 'src/category/category.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Product, User, Category])],
  providers: [ProductResolver, ProductService],
  exports: [MikroOrmModule],
})
export class ProductModule {}
