import { Conversation } from "@/common/entities/conversations.entity";
import { User } from "@/common/entities/users.entity";
import { Message } from "@/common/entities/messages.entity";
import { UUID } from "crypto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { ConversationsService } from "../conversations/conversations.service";
import { GraphQLError } from "graphql/error";
import { PubSub } from "graphql-subscriptions";
import { Inject } from "@nestjs/common";
import { generateConversationId } from "@/utils/hashing";
import { MessagesRepository } from "./messages.repository";
import { UsersRepository } from "../users/users.repository";
import { ConversationsRepository } from "../conversations/conversations.repository";
import { MessagesDto } from "./messages.dtos";
import { EntityManager } from "@mikro-orm/postgresql";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationsRepository: ConversationsRepository,

    @InjectRepository(User)
    private readonly usersRepository: UsersRepository,

    @InjectRepository(Message)
    private readonly messagesRepository: MessagesRepository,

    private readonly conversationsService: ConversationsService,

    private readonly em: EntityManager,

    @Inject("PUB_SUB")
    private pubSub: PubSub,
  ) {}

  async send(messageDto: MessagesDto): Promise<Message> {
    const sender = await this.usersRepository.findOne(messageDto.senderId);
    if (!sender) {
      throw new GraphQLError("Sender not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    let conversation: Conversation | null = null;
    if (messageDto.conversationId) {
      conversation = await this.conversationsRepository.findOne(messageDto.conversationId);
      if (!conversation) {
        throw new GraphQLError("Conversation not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
    } else if (messageDto.participantIds) {
      conversation = await this.conversationsService.create(messageDto.participantIds);
    }

    const message = this.messagesRepository.createOne(
      messageDto.text,
      sender,
      conversation as Conversation,
    );

    conversation = this.conversationsRepository.updateOne(conversation as Conversation, message);

    await this.em.flush();

    await this.messagesRepository.populate(message, [
      "conversation",
      "conversation.participants",
      "sender",
    ]);

    await this.pubSub.publish("messageSent", { messageSent: message });
    await this.pubSub.publish("messageSentToUser", {
      messageSentToUser: message,
    });

    return message;
  }

  async get(conversationId?: string, participantIds?: UUID[]): Promise<Message[]> {
    if (participantIds && participantIds.length > 0) {
      const participants = await this.usersRepository.find({
        id: { $in: participantIds },
      });

      if (participants.length !== participantIds.length) {
        throw new GraphQLError("One or more participants not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      conversationId = generateConversationId(participantIds);
    }

    const messages = await this.messagesRepository.find({
      conversation: conversationId,
    });

    return messages;
  }
}
