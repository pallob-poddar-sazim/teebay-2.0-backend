import { Conversation } from "@/common/entities/conversations.entity";
import { Message } from "@/common/entities/messages.entity";
import { User } from "@/common/entities/users.entity";
import { CustomSQLBaseRepository } from "@/common/repository/custom-sql-base.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MessagesRepository extends CustomSQLBaseRepository<Message> {
  createOne(text: string, sender: User, conversation: Conversation) {
    const message = new Message(text, sender, conversation);

    this.em.persist(message);

    return message;
  }
}
