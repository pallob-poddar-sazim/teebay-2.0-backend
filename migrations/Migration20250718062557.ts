import { Migration } from '@mikro-orm/migrations';

export class Migration20250718062557 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "messages" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "text" varchar(255) not null, "sender_id" varchar(255) not null, "conversation_id" varchar(255) not null, constraint "messages_pkey" primary key ("id"));`);

    this.addSql(`alter table "messages" add constraint "messages_sender_id_foreign" foreign key ("sender_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "messages" add constraint "messages_conversation_id_foreign" foreign key ("conversation_id") references "conversations" ("id") on update cascade;`);

    this.addSql(`alter table "conversations" drop constraint "conversations_last_message_id_foreign";`);

    this.addSql(`alter table "conversations" add constraint "conversations_last_message_id_foreign" foreign key ("last_message_id") references "messages" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "message" ("id" varchar(255) not null, "conversation_id" varchar(255) not null, "sender_id" varchar(255) not null, "text" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "message_pkey" primary key ("id"));`);

    this.addSql(`alter table "message" add constraint "message_conversation_id_foreign" foreign key ("conversation_id") references "conversations" ("id") on update cascade;`);
    this.addSql(`alter table "message" add constraint "message_sender_id_foreign" foreign key ("sender_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "conversations" drop constraint "conversations_last_message_id_foreign";`);

    this.addSql(`alter table "conversations" add constraint "conversations_last_message_id_foreign" foreign key ("last_message_id") references "message" ("id") on update cascade on delete set null;`);
  }

}
