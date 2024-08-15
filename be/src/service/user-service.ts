import { PrismaClient, User } from "@prisma/client";
import { CreateUserRequest, LoginUserRequest, toUserResponse, UserResponse } from "../model/user_model";
import { loginUserValidation, registerUserValidation } from "../validation/user-validation";
import { validate } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class UserService {
    static async register(request: CreateUserRequest) : Promise<UserResponse> {
        const registerRequest = validate(registerUserValidation, request);

        const totalUserWithSameEmail = await prisma.user.count({
            where: {
                email: registerRequest.email
            }
        });

        if (totalUserWithSameEmail != 0) {
            throw new ResponseError(400, "Email already exists");
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        let membershipTypeName = registerRequest.membershipTypeId || 1;
        const membershipType = await prisma.membershipType.findUnique({
            where: { id: membershipTypeName },
        });

        if (!membershipType) {
            throw new ResponseError(400, "Invalid membership type");
        }

        const user = await prisma.user.create({
            data: {
                email: registerRequest.email,
                password: registerRequest.password,
                name: registerRequest.name,
                membershipType: {
                    connect: {
                        id: membershipType.id
                    }
                }
            }
        });

        return toUserResponse(user);
    }

    static async login(request: LoginUserRequest) : Promise<UserResponse> {
        const loginRequest = validate(loginUserValidation, request);

        let user = await prisma.user.findUnique({
            where: {
                email: loginRequest.email
            }
        });

        if (!user) {
            throw new ResponseError(400, "User not found");
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password!);

        if (!isPasswordValid) {
            throw new ResponseError(400, "Email or password is wrong");
        }

        const token = jwt.sign({ email: user.email }, "secret", { expiresIn: "1h" });

        user = await prisma.user.update({
            where: {
                email: user.email
            },
            data: {
                token: token
            }
        })

        const response = toUserResponse(user);
        response.token = user.token!;
        return response;
    }

    static async logout (user: string): Promise<UserResponse> {
        const result = await prisma.user.update({
            where: {
                email: user
            },
            data: {
                token: null
            }
        })

        return toUserResponse(result);
    }
}
