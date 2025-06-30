import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Conversation } from 'src/conversation/conversation.entity';
import { Message } from './message.entity';
import { User } from 'src/user/user.entity';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Conversation, User, Message]),
    ConversationModule,
  ],
  providers: [MessageResolver, MessageService],
})
export class MessageModule {}
