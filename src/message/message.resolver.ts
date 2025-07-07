import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { UUID } from 'crypto';
import { handleError, handleSuccess } from 'src/utils/graphqlResponse';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';

@Resolver()
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,

    @Inject('PUB_SUB')
    private pubSub: PubSub,
  ) {}

  @Query()
  async getMessages(@Args('conversationId') conversationId: string) {
    try {
      const messages = await this.messageService.getMessages(conversationId);

      return handleSuccess('Successfully retrieved messages', messages);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

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

  @Subscription('messageSent', {
    filter: (payload, variables) =>
      payload.messageSent.conversation.id === variables.conversationId,
  })
  messageSent(@Args('conversationId') conversationId: string) {
    return this.pubSub.asyncIterableIterator('messageSent');
  }
}
