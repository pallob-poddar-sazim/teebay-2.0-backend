import { Args, Query, Resolver } from "@nestjs/graphql";
import { FileUploadsService } from "./file-uploads.service";
import { handleError, handleSuccess } from "@/utils/graphql-response";

@Resolver()
export class FileUploadsResolver {
  constructor(private readonly fileUploadsService: FileUploadsService) {}

  @Query()
  async getPresignedUrl(@Args("name") name: string, @Args("type") type: string) {
    try {
      const signedUrl = await this.fileUploadsService.getPresignedUrl({ name, type });

      return handleSuccess("Successfully retrieved signedUrl", signedUrl);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }
}
