import { Test } from "@nestjs/testing";
import { MessagesService } from "./messages.service";
import { UsersRepository } from "../users/users.repository";
import { GraphQLError } from "graphql/error";
import { ConversationsService } from "../conversations/conversations.service";
import { EntityManager } from "@mikro-orm/postgresql";
import { PubSub } from "graphql-subscriptions";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { Conversation } from "@/common/entities/conversations.entity";
import { User } from "@/common/entities/users.entity";
import { Message } from "@/common/entities/messages.entity";
import { ConversationsRepository } from "../conversations/conversations.repository";
import { MessagesRepository } from "./messages.repository";

describe("MessagesService", () => {
  let messagesService: MessagesService;
  let usersRepository: UsersRepository;
  let conversationsRepository: ConversationsRepository;
  let conversationsService: ConversationsService;
  let messagesRepository: MessagesRepository;
  let em: EntityManager;
  let pubSub: PubSub;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(Conversation),
          useValue: {
            findOne: jest.fn(),
            updateOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Message),
          useValue: {
            createOne: jest.fn(),
            populate: jest.fn(),
          },
        },
        {
          provide: ConversationsService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: EntityManager,
          useValue: {
            flush: jest.fn(),
          },
        },
        {
          provide: "PUB_SUB",
          useValue: new PubSub(),
        },
      ],
    }).compile();

    messagesService = moduleRef.get(MessagesService);
    usersRepository = moduleRef.get(getRepositoryToken(User));
    conversationsRepository = moduleRef.get(getRepositoryToken(Conversation));
    conversationsService = moduleRef.get(ConversationsService);
    messagesRepository = moduleRef.get(getRepositoryToken(Message));
    em = moduleRef.get(EntityManager);
    pubSub = moduleRef.get("PUB_SUB");
  });

  describe("send", () => {
    it("should throw an error if no user matches the senderId", async () => {
      jest.spyOn(usersRepository, "findOne").mockResolvedValue(null);

      const promise = messagesService.send({
        text: "Hello",
        senderId: "550e8400-e29b-41d4-a716-446655440000",
        conversationId: "550e8400-e29b-41d4-a716-446655440001",
      });

      await expect(promise).rejects.toThrow(GraphQLError);
      await expect(promise).rejects.toThrow("Sender not found");
    });

    it("should throw an error if conversationId is provided but no conversation matches the conversationId", async () => {
      jest.spyOn(usersRepository, "findOne").mockResolvedValue("abc");
      jest.spyOn(conversationsRepository, "findOne").mockResolvedValue(null);

      const promise = messagesService.send({
        text: "Hello",
        senderId: "550e8400-e29b-41d4-a716-446655440000",
        conversationId: "550e8400-e29b-41d4-a716-446655440001",
      });

      await expect(promise).rejects.toThrow(GraphQLError);
      await expect(promise).rejects.toThrow("Conversation not found");
    });

    it("should create a conversation and send a message if participantIds are provided", async () => {
      jest.spyOn(usersRepository, "findOne").mockResolvedValue("user");
      jest.spyOn(conversationsRepository, "findOne").mockResolvedValue("existing-conversation");
      jest.spyOn(conversationsService, "create").mockResolvedValue("new-conversation" as any);
      jest.spyOn(messagesRepository, "createOne").mockReturnValue("message" as any);
      jest
        .spyOn(conversationsRepository, "updateOne")
        .mockReturnValue("updated-conversation" as any);
      jest.spyOn(em, "flush").mockResolvedValue();
      jest.spyOn(messagesRepository, "populate").mockResolvedValue("populated-message");
      jest.spyOn(pubSub, "publish").mockResolvedValue();

      const promise = messagesService.send({
        text: "Hello",
        senderId: "550e8400-e29b-41d4-a716-446655440000",
        participantIds: [
          "550e8400-e29b-41d4-a716-446655440000",
          "550e8400-e29b-41d4-a716-446655440001",
        ],
      });

      await expect(promise).resolves.toEqual("message");
    });

    it("should send a message if conversationId is provided", async () => {
      jest.spyOn(usersRepository, "findOne").mockResolvedValue("user");
      jest.spyOn(conversationsRepository, "findOne").mockResolvedValue("existing-conversation");
      jest.spyOn(messagesRepository, "createOne").mockReturnValue("message" as any);
      jest
        .spyOn(conversationsRepository, "updateOne")
        .mockReturnValue("updated-conversation" as any);
      jest.spyOn(em, "flush").mockResolvedValue();
      jest.spyOn(messagesRepository, "populate").mockResolvedValue("populated-message");
      jest.spyOn(pubSub, "publish").mockResolvedValue();

      const promise = messagesService.send({
        text: "Hello",
        senderId: "550e8400-e29b-41d4-a716-446655440000",
        conversationId: "550e8400-e29b-41d4-a716-446655440001",
      });

      await expect(promise).resolves.toEqual("message");
    });
  });
});
