import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Rental } from './rental.entity';
import { User } from 'src/user/user.entity';
import { Product } from 'src/product/product.entity';
import { RentalService } from './rental.service';
import { RentalResolver } from './rental.resolver';

@Module({
  imports: [MikroOrmModule.forFeature([Rental, User, Product])],
  providers: [RentalResolver, RentalService],
})
export class RentalModule {}
