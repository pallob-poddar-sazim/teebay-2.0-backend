import { Args, Query, Resolver } from '@nestjs/graphql';
import { ConversationService } from './conversation.service';
import { UUID } from 'crypto';
import { handleError, handleSuccess } from 'src/utils/graphqlResponse';

@Resolver()
export class ConversationResolver {
  constructor(private readonly conversationService: ConversationService) {}

  @Query()
  async getConversationsByUserId(@Args('userId') userId: UUID) {
    try {
      const conversations =
        await this.conversationService.getConversationsByUserId(userId);

      return handleSuccess(
        'Successfully retrived conversations',
        conversations,
      );
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }
}
