import { PrismaClient, Role } from "@prisma/client"
import { CreateUserInterface, PatchUserInterface, ServiceResponse, TokenPayload } from "../types";
import bcrypt from "bcryptjs"
import config from "../config/config";

const prisma = new PrismaClient();

export class UsersService {

    static async getAll(page: number, pageSize: number) {
        const users = await prisma.user.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return users;
    }

    static async getOne(userId: number): Promise<ServiceResponse> {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return {
                status: 404,
                message: `User by id: ${userId} not found`
            }
        }

        return {
            status: 200,
            message: '',
            data: user
        }

    }

    static async create(userData: CreateUserInterface): Promise<ServiceResponse> {
        let password = config.DEFAULT_USER_PASSWORD;

        const existingUser = await this.findByEmail(userData.email);

        if (existingUser) {
            return {
                status: 409,
                message: `User with the email: ${userData.email} has already been registered `
            }
        }

        if (userData.password) {
            password = userData.password;
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email: userData.email,
                password: hashedPassword,
                role: userData.role,
                username: userData.username
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true
            }
        });

        const response: ServiceResponse = {
            status: 200,
            message: '',
            data: user
        }
        return response
    }

    static async findByEmail(email: string): Promise<ServiceResponse> {
        const user = await prisma.user.findUnique({ where: { email: email } });

        if (!user) {
            return {
                status: 404,
                message: `User by email: ${email} not found`
            }
        }

        return {
            status: 200,
            message: '',
            data: user
        }
    }

    static async delete(userId: number): Promise<ServiceResponse> {
        const existingUser = await prisma.user.findUnique({ where: { id: userId } });

        if (!existingUser) {
            return {
                status: 404,
                message: `User id ${userId} not found`
            }
        }

        await prisma.user.delete({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                role: true
            }
        });

        return {
            status: 200,
            message: `User ${userId} deleted`,
        }
    }

    static async patch(userId: number, userData: Partial<PatchUserInterface>, payload: TokenPayload): Promise<ServiceResponse> {

        if (payload.role as Role !== 'ADMIN' && userId !== payload.id) {
            return {
                status: 403,
                message: 'Access denied'
            }
        }

        if (payload.role as Role !== 'ADMIN' && userData.role && userData.role !== payload.role) {
            return {
                status: 403,
                message: 'You cannot change roles'
            }
        }

        if (userData.email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email: userData.email,
                    id: userId
                }
            });

            if (existingUser) {
                return {
                    status: 400,
                    message: `'User with this email ${userData.email} already exists`
                }
            }

        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(userData.email && { email: userData.email }),
                ...(userData.username && { username: userData.username }),
                ...(userData.role && payload.role === 'ADMIN' && Object.values(Role).includes(userData.role) && { role: userData.role })
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        return {
            status: 200,
            message: '',
            data: user
        }
    }
}