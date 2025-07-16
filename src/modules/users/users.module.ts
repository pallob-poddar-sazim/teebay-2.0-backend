import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserResolver } from "./users.resolver";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { User } from "../../common/entities/users.entity";

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UserResolver, UsersService],
  exports: [MikroOrmModule.forFeature([User])],
})
export class UsersModule {}
