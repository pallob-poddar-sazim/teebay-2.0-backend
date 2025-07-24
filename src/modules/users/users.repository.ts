import { Injectable } from "@nestjs/common";
import { User } from "@/common/entities/users.entity";
import { CustomSQLBaseRepository } from "@/common/repository/custom-sql-base.repository";
import { UserDto } from "./users.dtos";

@Injectable()
export class UsersRepository extends CustomSQLBaseRepository<User> {
  createOne(userDto: UserDto) {
    const { name, email, phone, address, password } = userDto;

    const user = new User(name, email, phone, address, password);

    this.em.persist(user);

    return user;
  }
}
