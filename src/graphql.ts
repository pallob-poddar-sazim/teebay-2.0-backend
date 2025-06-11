
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
    getAllProducts(): ProductRetrieveResponse | Promise<ProductRetrieveResponse>;
    getProductsBySellerId(sellerId: string): ProductRetrieveResponse | Promise<ProductRetrieveResponse>;
    _empty(): Nullable<string> | Promise<Nullable<string>>;
}

export interface IMutation {
    createCategories(names: string[]): CategoryResponse | Promise<CategoryResponse>;
    createProduct(title: string, categoryIds: string[], description: string, price: number, rent: number, rentOption: RentOption, sellerId: string): ProductMutationResponse | Promise<ProductMutationResponse>;
    updateProduct(id: string, title?: Nullable<string>, categoryIds?: Nullable<string[]>, description?: Nullable<string>, price?: Nullable<number>, rent?: Nullable<number>, rentOption?: Nullable<RentOption>): ProductMutationResponse | Promise<ProductMutationResponse>;
    deleteProduct(id: string): ProductMutationResponse | Promise<ProductMutationResponse>;
    signUp(name: string, address: string, email: string, phone: string, password: string, confirmPassword: string): UserResponse | Promise<UserResponse>;
    signIn(email: string, password: string): UserResponse | Promise<UserResponse>;
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
