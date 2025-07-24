import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class CSVProcessingService {
  constructor(
    @InjectQueue("csv")
    private csvQueue: Queue,
  ) {}

  async enqueue(key: string): Promise<{ key: string }> {
    await this.csvQueue.add("process-csv", { key });

    return { key };
  }
}
