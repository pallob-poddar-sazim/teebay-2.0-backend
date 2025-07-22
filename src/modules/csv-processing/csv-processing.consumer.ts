import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";
import { S3Service } from "@/modules/s3/s3.service";
import { ProductsService } from "@/modules/products/products.service";
import { Readable } from "stream";
import csvParser from "csv-parser";
import { EntityManager } from "@mikro-orm/postgresql";
import { CSVRowDto } from "./csv-processing.dtos";
import { ERentOption } from "@/common/enums/products.enums";
import { UUID } from "crypto";

@Processor("csv")
@Injectable()
export class CSVProcessingConsumer extends WorkerHost {
  constructor(
    private readonly s3Service: S3Service,
    private readonly productsService: ProductsService,
    private readonly em: EntityManager,
  ) {
    super();
  }
  async process(job: Job) {
    const { key } = job.data as { key: string };
    const forkedEm = this.em.fork();

    const stream: Readable = await this.s3Service.getObjectStream(key);

    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on("data", (row: CSVRowDto) => {
          (async () => {
            try {
              const title = row.title?.replace(/\n/g, "");
              const categoryIds = JSON.parse(row.categoryIds?.replace(/\\"/g, '"')) as UUID[];
              const description = row.description?.replace(/\n/g, "");
              const price = parseFloat(row.price);
              const rent = parseFloat(row.rent);
              const rentOption = row.rentOption as ERentOption;
              const sellerId = row.sellerId as UUID;

              await this.productsService.createOne(
                {
                  title,
                  categoryIds,
                  description,
                  price,
                  rent,
                  rentOption,
                  sellerId,
                },
                forkedEm,
              );
            } catch (error: unknown) {
              if (error instanceof Error) {
                console.error(error.message);
              } else {
                console.error(error);
              }
            }
          })().catch((error) => {
            console.error("Unhandled error in CSV processing:", error);
          });
        })
        .on("end", () => {
          console.log("CSV processing complete.");
          resolve();
        })
        .on("error", reject);
    });
  }
}
