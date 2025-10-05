import { Role } from "@prisma/client";

export interface ServiceResponse {
    status: number,
    message: string,
    data?: any
}

export interface RegisterUserInterface {
    email: string,
    password: string
}

export interface ChangePasswordInterface extends RegisterUserInterface {
    newPassword: string
}

export interface UserInterface {
    id: number,
    email: string,
    password: string,
    username: string,
    role: Role,
    createdAt: string,
    updatedAt: string
}

export interface PatchUserInterface extends Pick<UserInterface, "username" | "email" | "role"> { }

export interface TokenPayload extends Pick<UserInterface, "id" | "email" | "role"> { }

export interface CreateUserInterface {
    email: string,
    username?: string,
    password?: string,
    defaultPassword?: string,
    role?: Role
}