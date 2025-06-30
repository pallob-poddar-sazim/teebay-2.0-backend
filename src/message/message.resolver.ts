import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { UUID } from 'crypto';
import { handleError, handleSuccess } from 'src/utils/graphqlResponse';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import { generateConversationId } from 'src/utils/hashing';

@Resolver()
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,

    @Inject('PUB_SUB')
    private pubSub: PubSub,
  ) {}

  @Mutation()
  async sendMessage(
    @Args('conversationId') conversationId: string,
    @Args('participantIds') participantIds: UUID[],
    @Args('senderId') senderId: UUID,
    @Args('text') text: string,
  ) {
    try {
      const message = await this.messageService.sendMessage(
        conversationId,
        participantIds,
        senderId,
        text,
      );

      return handleSuccess('Successfully created message', message);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Query()
  async getMessages(@Args('participantIds') participantIds: UUID[]) {
    try {
      const messages = await this.messageService.getMessages(participantIds);

      return handleSuccess('Successfully retrieved messages', messages);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Subscription('messageSent', {
    filter: (payload, variables) => {
      if (variables.conversationId)
        return payload.messageSent.conversation.id === variables.conversationId;
      if (variables.participantIds) {
        const conversationId = generateConversationId(variables.participantIds);
        return payload.messageSent.conversation.id === conversationId;
      }

      return false;
    },
  })
  messageSent(
    @Args('conversationId') conversationId?: string,
    @Args('participantIds') participantIds?: UUID[]
  ) {
    return this.pubSub.asyncIterableIterator('messageSent');
  }

  @Subscription('messageSentToUser', {
    filter: (payload, variables) => {
      return payload.messageSentToUser.conversation.participants
        .getItems()
        .some((user) => user.id === variables.userId);
    },
  })
  messageSentToUser(@Args('userId') userId: string) {
    return this.pubSub.asyncIterableIterator('messageSentToUser');
  }
}
