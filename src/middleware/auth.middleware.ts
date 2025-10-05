import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import config from '../config/config';
import { TokenPayload } from '../types';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
    user?: TokenPayload;
}

export const checkAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const now = Math.floor(Date.now() / 1000);
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    try {
        const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as any;
        const tokenExpireDate = new Date(decoded.exp).getTime();
        if (now > tokenExpireDate) {
            return res.status(403).json({ status: 403, message: 'Invalid or expired token' });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, role: true }
        });

        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }
        (req as AuthRequest).user = user;
        next();
    } catch (error) {
        return res.status(403).json({ status: 403, message: 'Invalid or expired token' });
    }
};

export const checkRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ status: 401, error: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ status: 403, error: 'Access denied. Only admin role available' });
        }
        next();
    };
};