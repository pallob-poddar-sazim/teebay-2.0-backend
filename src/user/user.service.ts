import { GraphQLError } from 'graphql';
import { UserRepository } from './user.repository';
import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import {
  hashPassword,
  comparePasswords,
} from 'src/utils/passwordSecurityHandler';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(
    name: string,
    address: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new GraphQLError('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = await this.userRepository.create({
      name,
      address,
      email,
      phone,
      password: hashedPassword,
    });

    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
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
