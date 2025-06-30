import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Conversation } from '../conversation/conversation.entity';
import { User } from '../user/user.entity';

@Entity()
export class Message {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @ManyToOne(() => Conversation)
  conversation!: Conversation;

  @ManyToOne(() => User)
  sender!: User;

  @Property()
  text!: string;

  @Property({ onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
