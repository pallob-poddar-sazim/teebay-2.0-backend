import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: UUID): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async create(data: {
    name: string;
    address: string;
    email: string;
    phone: string;
    password: string;
  }) {
    const user = await this.prisma.user.create({
      data,
    });

    return user;
  }
}
