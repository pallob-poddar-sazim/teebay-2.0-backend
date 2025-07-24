import { Migration } from '@mikro-orm/migrations';

export class Migration20250717103025 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "rentals" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "rent_start_date" timestamptz not null, "rent_end_date" timestamptz not null, "product_id" varchar(255) not null, "borrower_id" varchar(255) not null, constraint "rentals_pkey" primary key ("id"));`);

    this.addSql(`alter table "rentals" add constraint "rentals_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);
    this.addSql(`alter table "rentals" add constraint "rentals_borrower_id_foreign" foreign key ("borrower_id") references "users" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "rental" ("id" varchar(255) not null, "product_id" varchar(255) not null, "borrower_id" varchar(255) not null, "rent_start_date" timestamptz not null, "rent_end_date" timestamptz not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "rental_pkey" primary key ("id"));`);

    this.addSql(`alter table "rental" add constraint "rental_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);
    this.addSql(`alter table "rental" add constraint "rental_borrower_id_foreign" foreign key ("borrower_id") references "users" ("id") on update cascade;`);
  }

}
