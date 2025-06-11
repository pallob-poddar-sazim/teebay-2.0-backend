import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { PurchaseResolver } from './purchase.resolver';
import { PurchaseService } from './purchase.service';
import { Purchase } from './purchase.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Purchase, User, Product])],
  providers: [PurchaseResolver, PurchaseService],
})
export class PurchaseModule {}
