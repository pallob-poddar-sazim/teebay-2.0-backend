import { Migration } from '@mikro-orm/migrations';

export class Migration20250629161939 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "conversation" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "conversation_pkey" primary key ("id"));`);

    this.addSql(`create table "message" ("id" varchar(255) not null, "conversation_id" varchar(255) not null, "sender_id" varchar(255) not null, "text" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "message_pkey" primary key ("id"));`);

    this.addSql(`create table "conversation_participants" ("conversation_id" varchar(255) not null, "user_id" varchar(255) not null, constraint "conversation_participants_pkey" primary key ("conversation_id", "user_id"));`);

    this.addSql(`alter table "message" add constraint "message_conversation_id_foreign" foreign key ("conversation_id") references "conversation" ("id") on update cascade;`);
    this.addSql(`alter table "message" add constraint "message_sender_id_foreign" foreign key ("sender_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "conversation_participants" add constraint "conversation_participants_conversation_id_foreign" foreign key ("conversation_id") references "conversation" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "conversation_participants" add constraint "conversation_participants_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);
  }

}
