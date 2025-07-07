import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Conversation } from 'src/conversation/conversation.entity';
import { User } from 'src/user/user.entity';
import { Message } from './message.entity';
import { UUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConversationService } from 'src/conversation/conversation.service';
import { GraphQLError } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import { generateConversationId } from 'src/utils/hashing';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: EntityRepository<Conversation>,

    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,

    @InjectRepository(Message)
    private readonly messageRepository: EntityRepository<Message>,

    private readonly conversationService: ConversationService,

    private readonly em: EntityManager,

    @Inject('PUB_SUB')
    private pubSub: PubSub,
  ) {}

  async sendMessage(
    senderId: UUID,
    text: string,
    conversationId?: string,
    participantIds?: UUID[],
  ): Promise<Message> {
    const sender = await this.userRepository.findOne({ id: senderId });
    if (!sender) {
      throw new GraphQLError('Sender not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    let conversation;
    if (conversationId) {
      conversation = await this.conversationRepository.findOne({
        id: conversationId,
      });
      if (!conversation) {
        throw new GraphQLError('Conversation not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
    } else if (participantIds) {
      conversation = await this.conversationService.create(participantIds);
    }

    const message = this.messageRepository.create({
      conversation,
      sender,
      text,
    });

    const messageEm = this.messageRepository.getEntityManager();
    await messageEm.persistAndFlush(message);

    conversation.lastMessage = message;
    conversation.updatedAt = new Date();

    const conversationEm = this.conversationRepository.getEntityManager();
    await conversationEm.persistAndFlush(conversation);

    const createdMessage = await this.messageRepository.findOne(message.id, {
      populate: ['conversation', 'conversation.participants', 'sender'],
    });

    await this.pubSub.publish('messageSent', { messageSent: createdMessage });
    await this.pubSub.publish('messageSentToUser', {
      messageSentToUser: createdMessage,
    });

    return message;
  }

  async getMessages(participantIds: UUID[]): Promise<Message[] | null> {
    const participants = await this.userRepository.find({
      id: { $in: participantIds },
    });

    if (participants.length !== participantIds.length) {
      throw new GraphQLError('One or more participants not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const conversationId = generateConversationId(participantIds);

    const conversation = await this.conversationRepository.findOne({
      id: conversationId,
    });
    if (!conversation) return null;

    const messages = await this.messageRepository.find({
      conversation: conversation,
    });

    return messages;
  }
}
