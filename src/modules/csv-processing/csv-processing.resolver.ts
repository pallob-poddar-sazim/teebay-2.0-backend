import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CSVProcessingService } from "./csv-processing.service";
import { handleError, handleSuccess } from "@/utils/graphqlResponse";

@Resolver()
export class CSVProcessingResolver {
  constructor(private readonly csvProcessingService: CSVProcessingService) {}

  @Mutation()
  async processCSV(@Args("key") key: string) {
    try {
      const response = await this.csvProcessingService.enqueue(key);

      return handleSuccess("File has been enqueued to be processed", response);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }
}
