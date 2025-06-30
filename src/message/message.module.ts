import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Conversation } from 'src/conversation/conversation.entity';
import { Message } from './message.entity';
import { User } from 'src/user/user.entity';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';
import { ConversationModule } from 'src/conversation/conversation.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    MikroOrmModule.forFeature([Conversation, User, Message]),
    ConversationModule,
  ],
  providers: [
    MessageResolver,
    MessageService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})
export class MessageModule {}
