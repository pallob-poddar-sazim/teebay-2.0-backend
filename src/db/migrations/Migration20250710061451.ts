import { Migration } from '@mikro-orm/migrations';

export class Migration20250710061451 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "conversation" add column "last_message_id" varchar(255) null;`);
    this.addSql(`alter table "conversation" add constraint "conversation_last_message_id_foreign" foreign key ("last_message_id") references "message" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "conversation" add constraint "conversation_last_message_id_unique" unique ("last_message_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "conversation" drop constraint "conversation_last_message_id_foreign";`);

    this.addSql(`alter table "conversation" drop constraint "conversation_last_message_id_unique";`);
  }

}
