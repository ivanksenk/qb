import { PrismaClient } from "@prisma/client";
import { ChangePasswordInterface, RegisterUserInterface, ServiceResponse, UserInterface } from "../types";
import bcrypt from 'bcryptjs';
import { TokenService } from "../utils/tokenService/token.servise";
import { TokenPayload } from "../types";
import config from "../config/config";


const prisma = new PrismaClient();

export class AuthService {

    static async register(userData: RegisterUserInterface) {
        const existingUser = await prisma.user.findUnique({ where: { email: userData.email } });

        if (existingUser) {
            return {
                status: 409,
                message: `The user with the email: ${userData.email} is already registered`
            }
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);

        const user = await prisma.user.create({
            data: {
                email: userData.email,
                password: hashedPassword
            },
            select: {
                id: true,
                email: true,
                role: true
            }
        });

        const accessToken = TokenService.generateAccessToken(user);
        const refreshToken = TokenService.generateRefreshToken(user);

        await TokenService.saveRefreshToken(+user.id, refreshToken);

        return {
            status: 201,
            message: 'Created',
            user,
            accessToken,
            refreshToken
        }

    }

    static async login(userData: RegisterUserInterface) {
        const user = await prisma.user.findUnique({ where: { email: userData.email } }) as UserInterface | null;
        if (!user) {
            return {
                status: 401,
                message: 'Invalid credentials'
            }
        }

        const isPasswordValid = await bcrypt.compare(userData.password, user.password);
        if (!isPasswordValid) {
            return {
                status: 401,
                message: 'Invalid credentials'
            }
        }

        if (userData.password === config.DEFAULT_USER_PASSWORD) {
            return {
                status: 403,
                message: 'You need to change your password. Visit /changepassword'
            }
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }


        const accessToken = TokenService.generateAccessToken(payload);
        const refreshToken = TokenService.generateRefreshToken(payload);

        await TokenService.saveRefreshToken(+user.id, refreshToken);

        return {
            status: 200,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken,
        };
    }

    static async refresh(token: string) {

        const payload: TokenPayload | null = await TokenService.verifyRefreshToken(token);

        if (!payload) {
            return {
                status: 401,
                message: 'Invalide or expired refresh token'
            }
        }

        const newPayload: TokenPayload = {
            id: payload.id,
            email: payload.email,
            role: payload.role
        }

        const newAccessToken = TokenService.generateAccessToken(newPayload);
        const newRefreshToken = TokenService.generateRefreshToken(newPayload);

        await TokenService.revokeRefreshToken(token);
        await TokenService.saveRefreshToken(payload.id, newRefreshToken)

        return {
            status: 200,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }
    }

    static async changePassword(userData: ChangePasswordInterface) {
        const user = await prisma.user.findUnique({ where: { email: userData.email } }) as UserInterface | null;
        if (!user) {
            return {
                status: 401,
                message: 'Invalid credentials'
            }
        }

        const isPasswordValid = await bcrypt.compare(userData.password, user.password);

        if (!isPasswordValid) {
            return {
                status: 401,
                message: 'Invalid credentials'
            }
        }

        const hashedPassword = await bcrypt.hash(userData.newPassword, 12);

        await prisma.user.update({
            where: { email: userData.email },
            data: {
                password: hashedPassword
            }
        })

        await TokenService.revokeAllUserTokens(user.id);
        //reddis скинуть сессию для юзера

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        const accessToken = TokenService.generateAccessToken(payload);
        const refreshToken = TokenService.generateRefreshToken(payload);

        await TokenService.saveRefreshToken(+user.id, refreshToken);

        return {
            status: 200,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken,
        };


    }

    static async me(userId: number): Promise<ServiceResponse> {
        const existUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
        if (!existUser) {
            return {
                status: 404,
                message: 'User not found',
            }
        }
        return {
            status: 200,
            message: '',
            data: existUser
        }
    }
}