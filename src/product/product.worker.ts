import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { S3Service } from 'src/file/s3.service';
import { ProductService } from './product.service';
import { Readable } from 'stream';
import csvParser from 'csv-parser';
import { EntityManager } from '@mikro-orm/postgresql';

@Processor('productQueue')
@Injectable()
export class ProductConsumer extends WorkerHost {
  constructor(
    private readonly s3Service: S3Service,
    private readonly productService: ProductService,
    private readonly em: EntityManager,
  ) {
    super();
  }
  async process(job: Job): Promise<void> {
    const { key } = job.data;
    const forkedEm = this.em.fork();

    const stream: Readable = await this.s3Service.getObjectStream(key);

    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on('data', async (row) => {
          try {
            row.title = row.title?.replace(/\n/g, '');
            row.categoryIds = JSON.parse(row.categoryIds?.replace(/\\"/g, '"'));
            row.description = row.description?.replace(/\n/g, '');
            row.price = parseFloat(row.price);
            row.rent = parseFloat(row.rent);

            await this.productService.createProduct(
              row.title,
              row.categoryIds,
              row.description,
              row.price,
              row.rent,
              row.rentOption,
              row.sellerId,
              forkedEm,
            );
          } catch (error: any) {
            console.error(error.message);
          }
        })
        .on('end', () => {
          console.log('CSV processing complete.');
          resolve();
        })
        .on('error', reject);
    });
  }
}
