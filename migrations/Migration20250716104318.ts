import { Migration } from '@mikro-orm/migrations';

export class Migration20250716104318 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "category" ("id" varchar(255) not null, "name" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "category_pkey" primary key ("id"));`);
    this.addSql(`alter table "category" add constraint "category_name_unique" unique ("name");`);

    this.addSql(`create table "users" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) not null, "address" varchar(255) not null, "password" varchar(255) not null, constraint "users_pkey" primary key ("id"));`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);

    this.addSql(`create table "product" ("id" varchar(255) not null, "title" varchar(255) not null, "description" text not null, "price" numeric(10,0) not null, "rent" numeric(10,0) not null, "rent_option" text check ("rent_option" in ('hr', 'day')) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "seller_id" varchar(255) not null, constraint "product_pkey" primary key ("id"));`);

    this.addSql(`create table "rental" ("id" varchar(255) not null, "product_id" varchar(255) not null, "borrower_id" varchar(255) not null, "rent_start_date" timestamptz not null, "rent_end_date" timestamptz not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "rental_pkey" primary key ("id"));`);

    this.addSql(`create table "purchase" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "buyer_id" varchar(255) not null, "product_id" varchar(255) not null, constraint "purchase_pkey" primary key ("id"));`);
    this.addSql(`alter table "purchase" add constraint "purchase_product_id_unique" unique ("product_id");`);

    this.addSql(`create table "category_products" ("category_id" varchar(255) not null, "product_id" varchar(255) not null, constraint "category_products_pkey" primary key ("category_id", "product_id"));`);

    this.addSql(`create table "conversation" ("id" varchar(255) not null, "last_message_id" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "conversation_pkey" primary key ("id"));`);
    this.addSql(`alter table "conversation" add constraint "conversation_last_message_id_unique" unique ("last_message_id");`);

    this.addSql(`create table "message" ("id" varchar(255) not null, "conversation_id" varchar(255) not null, "sender_id" varchar(255) not null, "text" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "message_pkey" primary key ("id"));`);

    this.addSql(`create table "conversation_participants" ("conversation_id" varchar(255) not null, "user_id" varchar(255) not null, constraint "conversation_participants_pkey" primary key ("conversation_id", "user_id"));`);

    this.addSql(`alter table "product" add constraint "product_seller_id_foreign" foreign key ("seller_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "rental" add constraint "rental_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);
    this.addSql(`alter table "rental" add constraint "rental_borrower_id_foreign" foreign key ("borrower_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "purchase" add constraint "purchase_buyer_id_foreign" foreign key ("buyer_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "purchase" add constraint "purchase_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);

    this.addSql(`alter table "category_products" add constraint "category_products_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "category_products" add constraint "category_products_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "conversation" add constraint "conversation_last_message_id_foreign" foreign key ("last_message_id") references "message" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "message" add constraint "message_conversation_id_foreign" foreign key ("conversation_id") references "conversation" ("id") on update cascade;`);
    this.addSql(`alter table "message" add constraint "message_sender_id_foreign" foreign key ("sender_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "conversation_participants" add constraint "conversation_participants_conversation_id_foreign" foreign key ("conversation_id") references "conversation" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "conversation_participants" add constraint "conversation_participants_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);
  }

}
