import { Migration } from '@mikro-orm/migrations';

export class Migration20250717082146 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "products" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "title" varchar(255) not null, "description" text not null, "price" numeric(10,0) not null, "rent" numeric(10,0) not null, "rent_option" text check ("rent_option" in ('hr', 'day')) not null, "seller_id" varchar(255) not null, constraint "products_pkey" primary key ("id"));`);

    this.addSql(`create table "products_categories" ("product_id" varchar(255) not null, "category_id" varchar(255) not null, constraint "products_categories_pkey" primary key ("product_id", "category_id"));`);

    this.addSql(`alter table "products" add constraint "products_seller_id_foreign" foreign key ("seller_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "products_categories" add constraint "products_categories_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "products_categories" add constraint "products_categories_category_id_foreign" foreign key ("category_id") references "categories" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "rental" drop constraint "rental_product_id_foreign";`);

    this.addSql(`alter table "purchase" drop constraint "purchase_product_id_foreign";`);

    this.addSql(`alter table "rental" add constraint "rental_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);

    this.addSql(`alter table "purchase" add constraint "purchase_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "product" ("id" varchar(255) not null, "title" varchar(255) not null, "description" text not null, "price" numeric(10,0) not null, "rent" numeric(10,0) not null, "rent_option" text check ("rent_option" in ('hr', 'day')) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "seller_id" varchar(255) not null, constraint "product_pkey" primary key ("id"));`);

    this.addSql(`create table "product_categories" ("product_id" varchar(255) not null, "category_id" varchar(255) not null, constraint "product_categories_pkey" primary key ("product_id", "category_id"));`);

    this.addSql(`alter table "product" add constraint "product_seller_id_foreign" foreign key ("seller_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "product_categories" add constraint "product_categories_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "product_categories" add constraint "product_categories_category_id_foreign" foreign key ("category_id") references "categories" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "rental" drop constraint "rental_product_id_foreign";`);

    this.addSql(`alter table "purchase" drop constraint "purchase_product_id_foreign";`);

    this.addSql(`alter table "rental" add constraint "rental_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);

    this.addSql(`alter table "purchase" add constraint "purchase_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);
  }

}
