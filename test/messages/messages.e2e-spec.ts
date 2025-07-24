import { AppModule } from "@/app.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import {
  SEND_MESSAGE_WITH_CONVERSATION_ID_MUTATION,
  SEND_MESSAGE_WITH_PARTICIPANT_IDS_MUTATION,
} from "./messages.graphql";
import { MikroORM } from "@mikro-orm/postgresql";
import mikroOrmConfig from "../../mikro-orm.config";

describe("MessagesResolver (e2e)", () => {
  let app: INestApplication;
  let orm: MikroORM;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    orm = (await MikroORM.init(mikroOrmConfig)) as any;
    await app.init();
  });

  afterAll(async () => {
    await orm.close();
    await app.close();
  });

  describe("mutation sendMessage", () => {
    const nonExistingSenderId = crypto.randomUUID();
    const existingSenderId = "a8ed232d-647b-43ed-ba94-3d9bcb0f9af6";
    const text = "Hello";
    const nonExistingParticipantIds = [
      "0c30c956-0ad2-4adb-9365-6474741053b1",
      "a8ed232d-647b-43ed-ba94-3d9bcb0f9af6",
    ];
    const participantIdsWithoutExistingConversation = [
      "0c30c956-0ad2-4adb-9365-6474741053b0",
      "a8ed232d-647b-43ed-ba94-3d9bcb0f9af6",
    ];
    const nonExistingConversationId = "conversation";
    const existingConversationId =
      "865a44bd6df295f8403a8a3ec5897479bbdd7e9d8a45b828f57b45c4a9129e69";

    it("should throw an error if no user matches the senderId", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: SEND_MESSAGE_WITH_PARTICIPANT_IDS_MUTATION,
          variables: { senderId: nonExistingSenderId, text, nonExistingParticipantIds },
        });

      expect(response.body.data.sendMessage.message).toBe("Sender not found");
    });

    it("should throw an error if conversationId is provided but no conversation matches the conversationId", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: SEND_MESSAGE_WITH_CONVERSATION_ID_MUTATION,
          variables: {
            senderId: existingSenderId,
            text,
            conversationId: nonExistingConversationId,
          },
        });

      expect(response.body.data.sendMessage.message).toBe("Conversation not found");
    });

    it("should throw an error if one or more participants is not found", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: SEND_MESSAGE_WITH_PARTICIPANT_IDS_MUTATION,
          variables: {
            senderId: existingSenderId,
            text,
            participantIds: nonExistingParticipantIds,
          },
        });

      expect(response.body.data.sendMessage.message).toBe("One or more participants not found");
    });

    it("should create a conversation and send a message if participantIds are provided", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: SEND_MESSAGE_WITH_PARTICIPANT_IDS_MUTATION,
          variables: {
            senderId: existingSenderId,
            text,
            participantIds: participantIdsWithoutExistingConversation,
          },
        });

      const data = response.body.data.sendMessage;
      const returnedIds = data.data.conversation.participants
        .map((participant) => participant.id)
        .sort();
      const expectedIds = [...participantIdsWithoutExistingConversation].sort();

      expect(data.message).toBe("Successfully created message");
      expect(data.data.text).toBe(text);
      expect(data.data.sender.id).toBe(existingSenderId);
      expect(returnedIds).toEqual(expectedIds);
    });

    it("should send a message if conversationId is provided", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: SEND_MESSAGE_WITH_CONVERSATION_ID_MUTATION,
          variables: {
            senderId: existingSenderId,
            text,
            conversationId: existingConversationId,
          },
        });

      const data = response.body.data.sendMessage;

      expect(data.message).toBe("Successfully created message");
      expect(data.data.text).toBe(text);
      expect(data.data.sender.id).toBe(existingSenderId);
      expect(data.data.conversation.id).toBe(existingConversationId);
    });
  });
});
