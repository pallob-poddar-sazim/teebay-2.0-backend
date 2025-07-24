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
import { S3Module } from "./modules/s3/s3.module";
import { CSVProcessingModule } from "./modules/csv-processing/csv-processing.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import mikroOrmConfig from "../mikro-orm.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get("REDIS_HOST"),
          port: 6379,
        },
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forRoot(mikroOrmConfig),
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
