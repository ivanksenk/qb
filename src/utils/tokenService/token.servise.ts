import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { UserInterface } from '../../types';
import config from '../../config/config';
import { TokenPayload } from '../../types';

const prisma = new PrismaClient();



export class TokenService {
    static generateAccessToken(userData: Partial<UserInterface>): string {
        return jwt.sign(userData, config.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    }

    static generateRefreshToken(userData: Partial<UserInterface>): string {
        return jwt.sign(userData, config.JWT_REFRESH_SECRET!, { expiresIn: '7d' }
        );
    }

    static async saveRefreshToken(userId: number, token: string): Promise<void> {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt
            }
        });
    }

    static async verifyRefreshToken(token: string): Promise<TokenPayload | null> {
        try {
            const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;

            const storedToken = await prisma.refreshToken.findUnique({
                where: { token },
                include: { user: true }
            });

            if (!storedToken) {
                return null;
            }


            if (storedToken.expiresAt < new Date()) {
                await this.revokeRefreshToken(token);
                return null;
            }

            return payload;
        } catch (error) {
            return null;
        }
    }

    static async revokeRefreshToken(token: string): Promise<void> {
        await prisma.refreshToken.delete({
            where: { token }
        });
    }

    static async revokeAllUserTokens(userId: number): Promise<void> {
        await prisma.refreshToken.deleteMany({
            where: { userId }
        });
    }

    static async cleanupExpiredTokens(): Promise<void> {
        await prisma.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });
    }
}