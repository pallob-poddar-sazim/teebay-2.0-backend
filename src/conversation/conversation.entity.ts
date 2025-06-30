import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { Message } from '../message/message.entity';

@Entity()
export class Conversation {
  @PrimaryKey()
  id!: string;

  @ManyToMany(() => User, (user) => user.conversations, { owner: true })
  participants = new Collection<User>(this);

  @OneToMany(() => Message, (message) => message.conversation)
  messages = new Collection<Message>(this);

  @Property({ onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
