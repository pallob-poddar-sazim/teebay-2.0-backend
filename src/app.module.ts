import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { UsersModule } from "./modules/users/users.module";
import { join } from "path";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { CategoriesModule } from "./modules/categories/categories.module";
import { ProductModule } from "./modules/products/products.module";
import { PurchaseModule } from "./modules/purchases/purchases.module";
import { RentalsModule } from "./modules/rentals/rentals.module";
import { ConversationModule } from "./modules/conversations/conversations.module";
import { MessageModule } from "./modules/messages/messages.module";
import { FileModule } from "./file/file.module";
import { BullModule } from "@nestjs/bullmq";
import config from "./config";

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
    ProductModule,
    PurchaseModule,
    RentalsModule,
    ConversationModule,
    MessageModule,
    FileModule,
  ],
})
export class AppModule {}
