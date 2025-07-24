import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { User } from "../../common/entities/users.entity";

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UsersResolver, UsersService],
  exports: [MikroOrmModule.forFeature([User])],
})
export class UsersModule {}
