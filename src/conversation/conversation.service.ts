import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Conversation } from './conversation.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { UUID } from 'crypto';
import { User } from 'src/user/user.entity';
import { GraphQLError } from 'graphql';
import { generateConversationId } from 'src/utils/hashing';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: EntityRepository<Conversation>,

    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async create(participantIds: UUID[]): Promise<Conversation> {
    const participants = await this.userRepository.find({
      id: { $in: participantIds },
    });

    if (participants.length !== participantIds.length) {
      throw new GraphQLError('One or more participants not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const conversationId = generateConversationId(participantIds);

    let conversation = await this.conversationRepository.findOne({
      id: conversationId,
    });

    if (!conversation) {
      conversation = this.conversationRepository.create({
        id: conversationId,
        participants,
      });

    if (!conversation) {
      conversation = this.conversationRepository.create({
        id: conversationId,
        participants,
      });
      await this.em.persistAndFlush(conversation);
    }

    return conversation;
  }

  async getConversationsByUserId(userId: UUID): Promise<Conversation[]> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const conversations = await this.conversationRepository.find(
      { participants: userId },
      {
        populate: ['participants', 'lastMessage'],
        orderBy: { updatedAt: 'DESC' },
      },
    );

    return conversations;
  }
}
