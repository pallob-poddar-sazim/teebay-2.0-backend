import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryKey,
} from "@mikro-orm/core";
import { User } from "./users.entity";
import { Message } from "./messages.entity";
import { ConversationsRepository } from "@/modules/conversations/conversations.repository";
import { CustomBaseEntity } from "./custom-base.entity";

@Entity({
  tableName: "conversations",
  repository: () => ConversationsRepository,
})
export class Conversation extends CustomBaseEntity {
  [EntityRepositoryType]?: ConversationsRepository;
  constructor(id: string, participants: User[]) {
    super();
    
    this.id = id;
    this.participants.set(participants);
  }
  @PrimaryKey()
  id!: string;

  @ManyToMany(() => User, (user) => user.conversations, { owner: true })
  participants = new Collection<User>(this);

  @OneToOne(() => Message, { nullable: true })
  lastMessage?: Message;

  @OneToMany(() => Message, (message) => message.conversation)
  messages = new Collection<Message>(this);
}
