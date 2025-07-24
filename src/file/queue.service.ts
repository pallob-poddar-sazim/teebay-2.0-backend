import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('productQueue')
    private productQueue: Queue,
  ) {}

  async enqueueCSVProcessing(bucket: string, key: string) {
    await this.productQueue.add('process-csv', { bucket, key });
  }
}
