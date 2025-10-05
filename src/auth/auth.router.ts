import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../middleware/auth.middleware";

export const AuthRouter = Router();

AuthRouter.post('/register', AuthController.register);
AuthRouter.post('/login', AuthController.login);
AuthRouter.post('/refresh', AuthController.refresh);
AuthRouter.post('/logout', checkAuth, AuthController.logout);
AuthRouter.patch('/changepassword', AuthController.changePassword);
AuthRouter.get('/me', checkAuth, AuthController.me);