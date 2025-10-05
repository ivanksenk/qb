import { NextFunction, Router } from "express";
import { Request, Response } from "express";
import { UsersRouter } from "./users/users.router";
import { AuthRouter } from "./auth/auth.router";


export const AppRouter = Router();

AppRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send({ message: 'Test Work Kosenko I.V.' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 500, message: 'Internal Server Error' });
    }
})


AppRouter.use('/auth', AuthRouter);
AppRouter.use('/users', UsersRouter);