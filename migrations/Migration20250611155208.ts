import { Migration } from '@mikro-orm/migrations';

export class Migration20250611155208 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "product" ("id" varchar(255) not null, "title" varchar(255) not null, "description" varchar(255) not null, "price" numeric(10,0) not null, "rent" numeric(10,0) not null, "rent_option" text check ("rent_option" in ('hr', 'day')) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "seller_id" varchar(255) not null, constraint "product_pkey" primary key ("id"));`);

    this.addSql(`create table "rental" ("id" varchar(255) not null, "product_id" varchar(255) not null, "borrower_id" varchar(255) not null, "rent_start_date" timestamptz not null, "rent_end_date" timestamptz not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "rental_pkey" primary key ("id"));`);

    this.addSql(`create table "purchase" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "buyer_id" varchar(255) not null, "product_id" varchar(255) not null, constraint "purchase_pkey" primary key ("id"));`);
    this.addSql(`alter table "purchase" add constraint "purchase_product_id_unique" unique ("product_id");`);

    this.addSql(`create table "category_products" ("category_id" varchar(255) not null, "product_id" varchar(255) not null, constraint "category_products_pkey" primary key ("category_id", "product_id"));`);

    this.addSql(`alter table "product" add constraint "product_seller_id_foreign" foreign key ("seller_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "rental" add constraint "rental_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);
    this.addSql(`alter table "rental" add constraint "rental_borrower_id_foreign" foreign key ("borrower_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "purchase" add constraint "purchase_buyer_id_foreign" foreign key ("buyer_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "purchase" add constraint "purchase_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);

    this.addSql(`alter table "category_products" add constraint "category_products_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "category_products" add constraint "category_products_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;`);
  }

}
