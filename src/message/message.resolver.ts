import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { UUID } from 'crypto';
import { handleError, handleSuccess } from 'src/utils/graphqlResponse';

@Resolver()
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

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
}
