import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { handleSuccess, handleError } from "@/utils/graphqlResponse";

@Resolver()
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation()
  async signUp(
    @Args("name") name: string,
    @Args("address") address: string,
    @Args("email") email: string,
    @Args("phone") phone: string,
    @Args("password") password: string,
    @Args("confirmPassword") confirmPassword: string,
  ) {
    try {
      if (password !== confirmPassword) {
        return handleError("Passwords do not match");
      }

      const user = await this.userService.signUp({ name, address, email, phone, password });

      return handleSuccess("Successfully signed up. Please sign in", user);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }

  @Mutation()
  async signIn(@Args("email") email: string, @Args("password") password: string) {
    try {
      const user = await this.userService.signIn(email, password);

      return handleSuccess("Successfully signed in", user);
    } catch (error) {
      console.error(error);
      return handleError(error);
    }
  }
}
