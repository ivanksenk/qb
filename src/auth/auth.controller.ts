import { Request, Response } from "express";
import { authUserSchema } from "./schemas/authUser.schema";
import { AuthService } from "./auth.service";
import { TokenService } from "../utils/tokenService/token.servise";
import { AuthRequest } from "../middleware/auth.middleware";
import { loginUserSchema } from "./schemas/loginUser.schema";
import { changePasswordSchema } from "./schemas/changePassword.schema";
import { TokenPayload } from "../types";


export class AuthController {

    static async register(req: Request, res: Response) {
        try {
            const { value: userData, error: validationError } = authUserSchema
                .prefs({
                    abortEarly: false,
                    errors: { label: 'key' }
                })
                .validate(req.body);

            if (validationError) {
                return res.status(422).send(validationError);
            }
            const user = await AuthService.register(userData);

            res.status(user.status).send(user);

        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 500, message: 'Internal Server Error' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { value: userData, error: validationError } = loginUserSchema
                .prefs({
                    abortEarly: false,
                    errors: { label: 'key' }
                })
                .validate(req.body);
            if (validationError) {
                return res.status(422).send(validationError);
            }
            const login = await AuthService.login(userData);

            res.status(login.status).send(login);

        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 500, message: 'Internal Server Error' });
        }
    }

    static async refresh(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return {
                    status: 400,
                    message: 'Refresh token required'
                }
            }
            const refresh = await AuthService.refresh(refreshToken);
            res.status(refresh.status).send(refresh);
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 500, message: 'Internal Server Error' });
        }
    }

    static async logout(req: AuthRequest, res: Response) {
        try {
            let userId = null;

            if (req.user && !req.body) {
                userId = req.user.id;
                await TokenService.revokeAllUserTokens(userId);
            }
            else if (req.body && req.body.refreshToken) {
                await TokenService.revokeRefreshToken(req.body.refreshToken);
            }
            //reddis скинуть сессии
            res.status(200).send({ message: 'Logout successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 500, message: 'Internal Server Error' });
        }
    }

    static async changePassword(req: AuthRequest, res: Response) {
        try {
            const { value: userData, error: validationError } = changePasswordSchema
                .prefs({
                    abortEarly: false,
                    errors: { label: 'key' }
                })
                .validate(req.body);

            if (validationError) {
                return res.status(422).send(validationError);
            }

            const result = await AuthService.changePassword(userData);

            res.status(result.status).send(result);

        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 500, message: 'Internal Server Error' });
        }
    }

    static async me(req: AuthRequest, res: Response) {
        try {

            const user = req.user as TokenPayload;

            if(!user){
                return res.status(404).send({status:404,message:'User not found'})
            }

            const existUser = await AuthService.me(user.id);

           res.status(existUser.status).send(existUser);

        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 500, message: 'Internal Server Error' });
        }
    }

}