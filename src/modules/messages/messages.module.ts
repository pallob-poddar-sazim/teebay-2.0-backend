import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Conversation } from "@/common/entities/conversations.entity";
import { Message } from "@/common/entities/messages.entity";
import { User } from "@/common/entities/users.entity";
import { MessagesResolver } from "./messages.resolver";
import { MessagesService } from "./messages.service";
import { ConversationsModule } from "../conversations/conversations.module";
import { PubSub } from "graphql-subscriptions";

@Module({
  imports: [MikroOrmModule.forFeature([Conversation, User, Message]), ConversationsModule],
  providers: [
    MessagesResolver,
    MessagesService,
    {
      provide: "PUB_SUB",
      useValue: new PubSub(),
    },
  ],
})
export class MessagesModule {}
