import { Entity, EntityRepositoryType, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Conversation } from "./conversations.entity";
import { User } from "./users.entity";
import { MessagesRepository } from "@/modules/messages/messages.repository";
import { CustomBaseEntity } from "./custom-base.entity";

@Entity({
  tableName: "messages",
  repository: () => MessagesRepository,
})
export class Message extends CustomBaseEntity {
  [EntityRepositoryType]?: MessagesRepository;
  constructor(text: string, sender: User, conversation: Conversation) {
    super();

    this.text = text;
    this.sender = sender;
    this.conversation = conversation;
  }
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property()
  text!: string;

  @ManyToOne(() => User)
  sender!: User;

  @ManyToOne(() => Conversation)
  conversation!: Conversation;
}
