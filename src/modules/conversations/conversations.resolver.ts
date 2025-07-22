import { Args, Query, Resolver } from "@nestjs/graphql";
import { ConversationsService } from "./conversations.service";
import { UUID } from "crypto";
import { handleError, handleSuccess } from "@/utils/graphql-response";

@Resolver()
export class ConversationsResolver {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Query()
  async getConversationsByUserId(@Args("userId") userId: UUID) {
    try {
      const conversations = await this.conversationsService.getAllByUserId(userId);

      return handleSuccess("Successfully retrived conversations", conversations);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }
}
