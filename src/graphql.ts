
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

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

export interface IQuery {
    _empty(): Nullable<string> | Promise<Nullable<string>>;
}

export interface IMutation {
    signUp(name: string, address: string, email: string, phone: string, password: string, confirmPassword: string): UserResponse | Promise<UserResponse>;
    signIn(email: string, password: string): UserResponse | Promise<UserResponse>;
}

type Nullable<T> = T | null;
