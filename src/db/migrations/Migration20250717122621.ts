import { Migration } from '@mikro-orm/migrations';

export class Migration20250717122621 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "purchases" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "product_id" varchar(255) not null, "buyer_id" varchar(255) not null, constraint "purchases_pkey" primary key ("id"));`);
    this.addSql(`alter table "purchases" add constraint "purchases_product_id_unique" unique ("product_id");`);

    this.addSql(`alter table "purchases" add constraint "purchases_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);
    this.addSql(`alter table "purchases" add constraint "purchases_buyer_id_foreign" foreign key ("buyer_id") references "users" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "purchase" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "buyer_id" varchar(255) not null, "product_id" varchar(255) not null, constraint "purchase_pkey" primary key ("id"));`);
    this.addSql(`alter table "purchase" add constraint "purchase_product_id_unique" unique ("product_id");`);

    this.addSql(`alter table "purchase" add constraint "purchase_buyer_id_foreign" foreign key ("buyer_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "purchase" add constraint "purchase_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);
  }

}
