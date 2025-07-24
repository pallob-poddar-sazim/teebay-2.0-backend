import { GraphQLError } from "graphql/error";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { User } from "../../common/entities/users.entity";
import { EntityManager } from "@mikro-orm/postgresql";
import { UsersRepository } from "./users.repository";
import { UserDto } from "./users.dtos";
import bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
  private readonly passwordSaltRounds = 10;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: UsersRepository,
    private readonly em: EntityManager,
  ) {}

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, this.passwordSaltRounds);
  }

  private async comparePasswords(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async signUp(signupDto: UserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ email: signupDto.email });
    if (existingUser) {
      throw new GraphQLError("User already exists");
    }

    const hashedPassword = await this.hashPassword(signupDto.password);

    const user = this.usersRepository.createOne({
      ...signupDto,
      password: hashedPassword,
    });

    await this.em.flush();

    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new GraphQLError("Incorrect email or password");
    }

    const checkPassword = await this.comparePasswords(password, user.password);
    if (!checkPassword) {
      throw new GraphQLError("Incorrect email or password");
    }

    return user;
  }
}
