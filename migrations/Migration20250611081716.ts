import { Migration } from '@mikro-orm/migrations';

export class Migration20250611081716 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "category" ("id" varchar(255) not null, "name" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "category_pkey" primary key ("id"));`);
    this.addSql(`alter table "category" add constraint "category_name_unique" unique ("name");`);
  }

}
