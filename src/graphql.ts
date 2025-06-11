
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

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
    _empty(): Nullable<string> | Promise<Nullable<string>>;
}

export interface IMutation {
    createCategories(names: string[]): CategoryResponse | Promise<CategoryResponse>;
    signUp(name: string, address: string, email: string, phone: string, password: string, confirmPassword: string): UserResponse | Promise<UserResponse>;
    signIn(email: string, password: string): UserResponse | Promise<UserResponse>;
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
