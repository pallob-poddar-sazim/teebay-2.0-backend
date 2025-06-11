import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';
import {
  hashPassword,
  comparePasswords,
} from 'src/utils/passwordSecurityHandler';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './user.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async signUp(
    name: string,
    address: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<User> {
    const existingUser = await this.userRepository.findOne({ email });
    if (existingUser) {
      throw new GraphQLError('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = this.userRepository.create({
      name,
      address,
      email,
      phone,
      password: hashedPassword,
    });
    await this.em.persistAndFlush(user);

    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new GraphQLError('Incorrect email or password');
    }

    const checkPassword = await comparePasswords(password, user.password);
    if (!checkPassword) {
      throw new GraphQLError('Incorrect email or password');
    }

    return user;
  }
}
