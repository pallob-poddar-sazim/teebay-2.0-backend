import { Migration } from '@mikro-orm/migrations';

export class Migration20250611051530 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "_ProductCategories" drop constraint "_ProductCategories_A_fkey";`);

    this.addSql(`alter table "Purchase" drop constraint "Purchase_productId_fkey";`);

    this.addSql(`alter table "Rental" drop constraint "Rental_productId_fkey";`);

    this.addSql(`alter table "_ProductCategories" drop constraint "_ProductCategories_B_fkey";`);

    this.addSql(`alter table "Product" drop constraint "Product_sellerId_fkey";`);

    this.addSql(`alter table "Purchase" drop constraint "Purchase_buyerId_fkey";`);

    this.addSql(`alter table "Rental" drop constraint "Rental_borrowerId_fkey";`);

    this.addSql(`create table "user" ("id" varchar(255) not null, "name" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) not null, "address" varchar(255) not null, "password" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`drop table if exists "Category" cascade;`);

    this.addSql(`drop table if exists "Product" cascade;`);

    this.addSql(`drop table if exists "Purchase" cascade;`);

    this.addSql(`drop table if exists "Rental" cascade;`);

    this.addSql(`drop table if exists "User" cascade;`);

    this.addSql(`drop table if exists "_ProductCategories" cascade;`);

    this.addSql(`drop table if exists "_prisma_migrations" cascade;`);

    this.addSql(`drop type "RentOption";`);
  }

  override async down(): Promise<void> {
    this.addSql(`create type "RentOption" as enum ('hr', 'day');`);
    this.addSql(`create table "Category" ("id" text not null, "name" text not null, "createdAt" timestamp(3) not null default CURRENT_TIMESTAMP, "updatedAt" timestamp(3) not null, constraint "Category_pkey" primary key ("id"));`);
    this.addSql(`alter table "Category" add constraint "Category_name_key" unique ("name");`);

    this.addSql(`create table "Product" ("id" text not null, "title" text not null, "description" text not null, "price" numeric(65,30) not null, "rent" numeric(65,30) not null, "rentOption" "RentOption" not null, "sellerId" text not null, "createdAt" timestamp(3) not null default CURRENT_TIMESTAMP, "updatedAt" timestamp(3) not null, constraint "Product_pkey" primary key ("id"));`);

    this.addSql(`create table "Purchase" ("id" text not null, "productId" text not null, "buyerId" text not null, "createdAt" timestamp(3) not null default CURRENT_TIMESTAMP, "updatedAt" timestamp(3) not null, constraint "Purchase_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX "Purchase_productId_key" ON public."Purchase" USING btree ("productId");`);

    this.addSql(`create table "Rental" ("id" text not null, "productId" text not null, "borrowerId" text not null, "rentStartDate" timestamp(3) not null, "rentEndDate" timestamp(3) not null, "createdAt" timestamp(3) not null default CURRENT_TIMESTAMP, "updatedAt" timestamp(3) not null, constraint "Rental_pkey" primary key ("id"));`);

    this.addSql(`create table "User" ("id" text not null, "name" text not null, "email" text not null, "phone" text not null, "address" text not null, "password" text not null, "createdAt" timestamp(3) not null default CURRENT_TIMESTAMP, "updatedAt" timestamp(3) not null, constraint "User_pkey" primary key ("id"));`);
    this.addSql(`alter table "User" add constraint "User_email_key" unique ("email");`);

    this.addSql(`create table "_ProductCategories" ("A" text not null, "B" text not null);`);
    this.addSql(`CREATE UNIQUE INDEX "_ProductCategories_AB_pkey" ON public."_ProductCategories" USING btree ("A", "B");`);
    this.addSql(`CREATE INDEX "_ProductCategories_B_index" ON public."_ProductCategories" USING btree ("B");`);

    this.addSql(`create table "_prisma_migrations" ("id" varchar(36) not null, "checksum" varchar(64) not null, "finished_at" timestamptz(6) null, "migration_name" varchar(255) not null, "logs" text null, "rolled_back_at" timestamptz(6) null, "started_at" timestamptz(6) not null default now(), "applied_steps_count" int4 not null default 0, constraint "_prisma_migrations_pkey" primary key ("id"));`);

    this.addSql(`alter table "Product" add constraint "Product_sellerId_fkey" foreign key ("sellerId") references "User" ("id") on update cascade on delete restrict;`);

    this.addSql(`alter table "Purchase" add constraint "Purchase_buyerId_fkey" foreign key ("buyerId") references "User" ("id") on update cascade on delete restrict;`);
    this.addSql(`alter table "Purchase" add constraint "Purchase_productId_fkey" foreign key ("productId") references "Product" ("id") on update cascade on delete restrict;`);

    this.addSql(`alter table "Rental" add constraint "Rental_borrowerId_fkey" foreign key ("borrowerId") references "User" ("id") on update cascade on delete restrict;`);
    this.addSql(`alter table "Rental" add constraint "Rental_productId_fkey" foreign key ("productId") references "Product" ("id") on update cascade on delete restrict;`);

    this.addSql(`alter table "_ProductCategories" add constraint "_ProductCategories_A_fkey" foreign key ("A") references "Category" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "_ProductCategories" add constraint "_ProductCategories_B_fkey" foreign key ("B") references "Product" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);
  }

}
