import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { purchaseResolver } from './purchase.resolver';
import { PurchaseService } from './purchase.service';
import { Purchase } from './purchase.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Purchase, User, Product])],
  providers: [purchaseResolver, PurchaseService],
})
export class PurchaseModule {}
