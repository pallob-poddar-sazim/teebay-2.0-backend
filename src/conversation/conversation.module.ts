import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { ConversationService } from './conversation.service';
import { Conversation } from './conversation.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User, Conversation])],
  providers: [ConversationService],
  exports: [MikroOrmModule, ConversationService],
})
export class ConversationModule {}
