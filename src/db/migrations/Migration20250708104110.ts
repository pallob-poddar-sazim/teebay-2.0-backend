import { Migration } from '@mikro-orm/migrations';

export class Migration20250708104110 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "product" alter column "description" type text using ("description"::text);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "product" alter column "description" type varchar(255) using ("description"::varchar(255));`);
  }

}
