import { Conversation } from "@/common/entities/conversations.entity";
import { Message } from "@/common/entities/messages.entity";
import { User } from "@/common/entities/users.entity";
import { CustomSQLBaseRepository } from "@/common/repository/custom-sql-base.repository";
import { Injectable } from "@nestjs/common";
import { UUID } from "crypto";

@Injectable()
export class ConversationsRepository extends CustomSQLBaseRepository<Conversation> {
  findAllByUserId(userId: UUID) {
    return this.find(
      { participants: userId },
      {
        populate: ["participants", "lastMessage"],
        orderBy: { updatedAt: "DESC" },
      },
    );
  }

  createOne(id: string, participants: User[]) {
    const conversation = new Conversation(id, participants);

    this.em.persist(conversation);

    return conversation;
  }

  updateOne(conversation: Conversation, lastMessage: Message) {
    conversation.lastMessage = lastMessage;

    this.em.persist(conversation);

    return conversation;
  }
}
