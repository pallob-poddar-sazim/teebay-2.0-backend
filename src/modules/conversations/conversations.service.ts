import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { Conversation } from "@/common/entities/conversations.entity";
import { EntityManager } from "@mikro-orm/postgresql";
import { UUID } from "crypto";
import { User } from "@/common/entities/users.entity";
import { GraphQLError } from "graphql/error";
import { generateConversationId } from "@/utils/crypto-helper";
import { ConversationsRepository } from "./conversations.repository";
import { UsersRepository } from "../users/users.repository";

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationsRepository: ConversationsRepository,

    @InjectRepository(User)
    private readonly usersRepository: UsersRepository,

    private readonly em: EntityManager,
  ) {}

  async getAllByUserId(userId: UUID): Promise<Conversation[]> {
    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const conversations = await this.conversationsRepository.findAllByUserId(userId);

    return conversations;
  }

  async create(participantIds: UUID[]): Promise<Conversation> {
    const participants = await this.usersRepository.find({
      id: { $in: participantIds },
    });
    if (participants.length !== participantIds.length) {
      throw new GraphQLError("One or more participants not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const conversationId = generateConversationId(participantIds);

    let conversation = await this.conversationsRepository.findOne(conversationId);

    if (!conversation) {
      conversation = this.conversationsRepository.createOne(conversationId, participants);

      await this.em.flush();
    }

    return conversation;
  }
}
