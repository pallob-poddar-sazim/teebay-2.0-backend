import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Category } from '@/common/entities/categories.entity';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';

@Module({
  imports: [MikroOrmModule.forFeature([Category])],
  providers: [CategoriesResolver, CategoriesService],
  exports: [MikroOrmModule.forFeature([Category])],
})
export class CategoriesModule {}
