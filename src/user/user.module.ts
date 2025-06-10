import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';

@Module({
  providers: [UserResolver, UserService, UserRepository],
})
export class UserModule {}
