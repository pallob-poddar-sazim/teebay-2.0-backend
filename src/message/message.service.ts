import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Conversation } from 'src/conversation/conversation.entity';
import { User } from 'src/user/user.entity';
import { Message } from './message.entity';
import { UUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConversationService } from 'src/conversation/conversation.service';
import { GraphQLError } from 'graphql';

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
  ) {}

  async sendMessage(
    conversationId: string,
    participantIds: UUID[],
    senderId: UUID,
    text: string,
  ): Promise<Message> {
    const sender = await this.userRepository.findOne({ id: senderId });
    if (!sender) {
      throw new GraphQLError('Sender not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    let conversation = await this.conversationRepository.findOne({
      id: conversationId,
    });
    if (!conversation) {
      conversation = await this.conversationService.create(participantIds);
    }

    const message = this.messageRepository.create({
      conversation,
      sender,
      text,
    });

    await this.em.persistAndFlush(message);

    return message;
  }
}
