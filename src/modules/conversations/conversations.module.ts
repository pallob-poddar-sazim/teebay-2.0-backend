import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { User } from "@/common/entities/users.entity";
import { ConversationsService } from "./conversations.service";
import { Conversation } from "@/common/entities/conversations.entity";
import { ConversationsResolver } from "./conversations.resolver";

@Module({
  imports: [MikroOrmModule.forFeature([User, Conversation])],
  providers: [ConversationsResolver, ConversationsService],
  exports: [MikroOrmModule.forFeature([Conversation]), ConversationsService],
})
export class ConversationsModule {}
