import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { MessagesService } from "./messages.service";
import { UUID } from "crypto";
import { handleError, handleSuccess } from "@/utils/graphqlResponse";
import { PubSub } from "graphql-subscriptions";
import { Inject } from "@nestjs/common";
import { generateConversationId } from "@/utils/hashing";

@Resolver()
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,

    @Inject("PUB_SUB")
    private pubSub: PubSub,
  ) {}

  @Mutation()
  async sendMessage(
    @Args("text") text: string,
    @Args("senderId") senderId: UUID,
    @Args("conversationId") conversationId?: string,
    @Args("participantIds") participantIds?: UUID[],
  ) {
    try {
      const message = await this.messagesService.send({
        text,
        senderId,
        conversationId,
        participantIds,
      });

      return handleSuccess("Successfully created message", message);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Query()
  async getMessages(
    @Args("conversationId") conversationId?: string,
    @Args("participantIds") participantIds?: UUID[],
  ) {
    try {
      const messages = await this.messagesService.get(conversationId, participantIds);

      return handleSuccess("Successfully retrieved messages", messages);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Subscription("messageSent", {
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
    @Args("conversationId") _conversationId?: string,
    @Args("participantIds") _participantIds?: UUID[],
  ) {
    return this.pubSub.asyncIterableIterator("messageSent");
  }

  @Subscription("messageSentToUser", {
    filter: (payload, variables) => {
      return payload.messageSentToUser.conversation.participants
        .getItems()
        .some((user) => user.id === variables.userId);
    },
  })
  messageSentToUser(@Args("userId") _userId: string) {
    return this.pubSub.asyncIterableIterator("messageSentToUser");
  }
}
