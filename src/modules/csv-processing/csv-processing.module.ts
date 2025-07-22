import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { S3Module } from "../s3/s3.module";
import { CSVProcessingResolver } from "./csv-processing.resolver";
import { CSVProcessingService } from "./csv-processing.service";
import { CSVProcessingConsumer } from "./csv-processing.consumer";
import { ProductsModule } from "../products/products.module";

@Module({
  imports: [
    S3Module,
    ProductsModule,
    BullModule.registerQueue({
      name: "csv",
    }),
  ],
  providers: [CSVProcessingResolver, CSVProcessingService, CSVProcessingConsumer],
})
export class CSVProcessingModule {}
