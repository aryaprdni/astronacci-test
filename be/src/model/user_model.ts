import { User } from "@prisma/client"

export type UserResponse = {
    email: string,
    name: string,
    token?: string
}

export type CreateUserRequest = {
    email: string,
    name: string,
    password: string,
    membershipTypeId: number | null
}

export type LoginUserRequest = {
    email: string,
    password: string
}

export function toUserResponse(user: User): UserResponse {
    return {
        email: user.email,
        name: user.name,
    }
}