import {
  Entity,
  PrimaryKey,
  Property,
  Unique,
  OneToMany,
  Collection,
  ManyToMany,
  EntityRepositoryType,
} from "@mikro-orm/core";
import { Product } from "./products.entity";
import { Purchase } from "./purchases.entity";
import { Rental } from "./rentals.entity";
import { Conversation } from "./conversations.entity";
import { Message } from "./messages.entity";
import { UsersRepository } from "@/modules/users/users.repository";
import { CustomBaseEntity } from "./custom-base.entity";

@Entity({
  tableName: "users",
  repository: () => UsersRepository,
})
export class User extends CustomBaseEntity {
  [EntityRepositoryType]?: UsersRepository;

  constructor(name: string, email: string, phone: string, address: string, password: string) {
    super();
    
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.password = password;
  }

  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property()
  name!: string;

  @Property()
  @Unique()
  email!: string;

  @Property()
  phone!: string;

  @Property()
  address!: string;

  @Property()
  password!: string;

  @OneToMany(() => Product, (product) => product.seller)
  products = new Collection<Product>(this);

  @OneToMany(() => Purchase, (purchase) => purchase.buyer)
  purchases = new Collection<Purchase>(this);

  @OneToMany(() => Rental, (rental) => rental.borrower)
  rentals = new Collection<Rental>(this);

  @ManyToMany(() => Conversation, (conversation) => conversation.participants)
  conversations = new Collection<Conversation>(this);

  @OneToMany(() => Message, (message) => message.sender)
  messages = new Collection<Message>(this);
}
