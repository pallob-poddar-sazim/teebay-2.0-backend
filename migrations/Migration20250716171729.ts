import { Migration } from '@mikro-orm/migrations';

export class Migration20250716171729 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "categories" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, constraint "categories_pkey" primary key ("id"));`);
    this.addSql(`alter table "categories" add constraint "categories_name_unique" unique ("name");`);

    this.addSql(`create table "product_categories" ("product_id" varchar(255) not null, "category_id" varchar(255) not null, constraint "product_categories_pkey" primary key ("product_id", "category_id"));`);

    this.addSql(`alter table "product_categories" add constraint "product_categories_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "product_categories" add constraint "product_categories_category_id_foreign" foreign key ("category_id") references "categories" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "category" ("id" varchar(255) not null, "name" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "category_pkey" primary key ("id"));`);
    this.addSql(`alter table "category" add constraint "category_name_unique" unique ("name");`);

    this.addSql(`create table "category_products" ("category_id" varchar(255) not null, "product_id" varchar(255) not null, constraint "category_products_pkey" primary key ("category_id", "product_id"));`);

    this.addSql(`alter table "category_products" add constraint "category_products_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "category_products" add constraint "category_products_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;`);
  }

}
