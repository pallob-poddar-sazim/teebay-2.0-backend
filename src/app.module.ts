import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { UsersModule } from "./modules/users/users.module";
import { join } from "path";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { CategoriesModule } from "./modules/categories/categories.module";
import { ProductsModule } from "./modules/products/products.module";
import { PurchasesModule } from "./modules/purchases/purchases.module";
import { RentalsModule } from "./modules/rentals/rentals.module";
import { ConversationsModule } from "./modules/conversations/conversations.module";
import { MessagesModule } from "./modules/messages/messages.module";
import { FileUploadsModule } from "./modules/file-uploads/file-uploads.module";
import { BullModule } from "@nestjs/bullmq";
import config from "./config";
import { S3Module } from "./modules/s3/s3.module";
import { CSVProcessingModule } from "./modules/csv-processing/csv-processing.module";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: {
        "graphql-ws": true,
      },
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      typePaths: ["./**/*.graphql"],
      definitions: {
        path: join(process.cwd(), "src/graphql.ts"),
      },
    }),
    BullModule.forRoot({
      connection: {
        host: config.redisHost,
        port: 6379,
      },
    }),
    MikroOrmModule.forRoot(),
    UsersModule,
    CategoriesModule,
    ProductsModule,
    PurchasesModule,
    RentalsModule,
    ConversationsModule,
    MessagesModule,
    S3Module,
    FileUploadsModule,
    CSVProcessingModule,
  ],
})
export class AppModule {}
