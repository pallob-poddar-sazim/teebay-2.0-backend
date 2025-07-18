import { Migration } from '@mikro-orm/migrations';

export class Migration20250717172933 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "conversations" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "last_message_id" varchar(255) null, constraint "conversations_pkey" primary key ("id"));`);
    this.addSql(`alter table "conversations" add constraint "conversations_last_message_id_unique" unique ("last_message_id");`);

    this.addSql(`create table "conversations_participants" ("conversation_id" varchar(255) not null, "user_id" varchar(255) not null, constraint "conversations_participants_pkey" primary key ("conversation_id", "user_id"));`);

    this.addSql(`alter table "conversations" add constraint "conversations_last_message_id_foreign" foreign key ("last_message_id") references "message" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "conversations_participants" add constraint "conversations_participants_conversation_id_foreign" foreign key ("conversation_id") references "conversations" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "conversations_participants" add constraint "conversations_participants_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "message" drop constraint "message_conversation_id_foreign";`);

    this.addSql(`alter table "message" add constraint "message_conversation_id_foreign" foreign key ("conversation_id") references "conversations" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "conversation" ("id" varchar(255) not null, "last_message_id" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "conversation_pkey" primary key ("id"));`);
    this.addSql(`alter table "conversation" add constraint "conversation_last_message_id_unique" unique ("last_message_id");`);

    this.addSql(`create table "conversation_participants" ("conversation_id" varchar(255) not null, "user_id" varchar(255) not null, constraint "conversation_participants_pkey" primary key ("conversation_id", "user_id"));`);

    this.addSql(`alter table "conversation" add constraint "conversation_last_message_id_foreign" foreign key ("last_message_id") references "message" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "conversation_participants" add constraint "conversation_participants_conversation_id_foreign" foreign key ("conversation_id") references "conversation" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "conversation_participants" add constraint "conversation_participants_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "message" drop constraint "message_conversation_id_foreign";`);

    this.addSql(`alter table "message" add constraint "message_conversation_id_foreign" foreign key ("conversation_id") references "conversation" ("id") on update cascade;`);
  }

}
