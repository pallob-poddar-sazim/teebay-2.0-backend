
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum RentOption {
    hr = "hr",
    day = "day"
}

export interface Category {
    id: string;
    name: string;
}

export interface CategoryResponse {
    success: boolean;
    message: string;
    data?: Nullable<Category[]>;
}

export interface IQuery {
    getAllCategories(): CategoryResponse | Promise<CategoryResponse>;
    getConversationsByUserId(userId: string): ConversationQueryResponse | Promise<ConversationQueryResponse>;
    getMessages(conversationId?: Nullable<string>, participantIds?: Nullable<string[]>): MessageQueryResponse | Promise<MessageQueryResponse>;
    getAllProducts(): ProductRetrieveResponse | Promise<ProductRetrieveResponse>;
    getProductsBySellerId(sellerId: string): ProductRetrieveResponse | Promise<ProductRetrieveResponse>;
    getPurchasesByUserId(userId: string): PurchaseRetrieveResponse | Promise<PurchaseRetrieveResponse>;
    getRentalsByUserId(userId: string): RentalRetrieveResponse | Promise<RentalRetrieveResponse>;
}

export interface IMutation {
    createCategories(names: string[]): CategoryResponse | Promise<CategoryResponse>;
    sendMessage(senderId: string, text: string, conversationId?: Nullable<string>, participantIds?: Nullable<string[]>): MessageMutationResponse | Promise<MessageMutationResponse>;
    createProduct(title: string, categoryIds: string[], description: string, price: number, rent: number, rentOption: RentOption, sellerId: string): ProductMutationResponse | Promise<ProductMutationResponse>;
    updateProduct(id: string, title?: Nullable<string>, categoryIds?: Nullable<string[]>, description?: Nullable<string>, price?: Nullable<number>, rent?: Nullable<number>, rentOption?: Nullable<RentOption>): ProductMutationResponse | Promise<ProductMutationResponse>;
    deleteProduct(id: string): ProductMutationResponse | Promise<ProductMutationResponse>;
    createPurchase(productId: string, buyerId: string): PurchaseMutationResponse | Promise<PurchaseMutationResponse>;
    createRental(productId: string, borrowerId: string, rentStartDate: Date, rentEndDate: Date): RentalMutationResponse | Promise<RentalMutationResponse>;
    signUp(name: string, address: string, email: string, phone: string, password: string, confirmPassword: string): UserResponse | Promise<UserResponse>;
    signIn(email: string, password: string): UserResponse | Promise<UserResponse>;
}

export interface ConversationQueryResponse {
    success: boolean;
    message: string;
    data?: Nullable<Conversation[]>;
}

export interface Conversation {
    id: string;
    participants?: Nullable<User[]>;
    lastMessage: Message;
}

export interface Message {
    id: string;
    conversation: Conversation;
    sender: User;
    text: string;
}

export interface MessageQueryResponse {
    success: boolean;
    message: string;
    data?: Nullable<Nullable<Message>[]>;
}

export interface MessageMutationResponse {
    success: boolean;
    message: string;
    data?: Nullable<Message>;
}

export interface ISubscription {
    messageSent(conversationId?: Nullable<string>, participantIds?: Nullable<string[]>): Nullable<Message> | Promise<Nullable<Message>>;
    messageSentToUser(userId: string): Nullable<Message> | Promise<Nullable<Message>>;
}

export interface Product {
    id: string;
    title: string;
    categories: Category[];
    description: string;
    price: number;
    rent: number;
    rentOption: RentOption;
    seller: User;
    createdAt: Date;
}

export interface ProductMutationResponse {
    success: boolean;
    message: string;
    data?: Nullable<Product>;
}

export interface ProductRetrieveResponse {
    success: boolean;
    message: string;
    data?: Nullable<Product[]>;
}

export interface Purchase {
    id: string;
    product: Product;
    buyer: User;
    createdAt: Date;
}

export interface PurchaseMutationResponse {
    success: boolean;
    message: string;
    data?: Nullable<Purchase>;
}

export interface PurchaseRetrieveResponse {
    success: boolean;
    message: string;
    data?: Nullable<Purchase[]>;
}

export interface Rental {
    id: string;
    product: Product;
    borrower: User;
    rentStartDate: Date;
    rentEndDate: Date;
    createdAt: Date;
}

export interface RentalMutationResponse {
    success: boolean;
    message: string;
    data?: Nullable<Rental>;
}

export interface RentalRetrieveResponse {
    success: boolean;
    message: string;
    data?: Nullable<Rental[]>;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface UserResponse {
    success: boolean;
    message: string;
    data?: Nullable<User>;
}

type Nullable<T> = T | null;
