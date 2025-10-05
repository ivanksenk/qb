import { Response } from "express";
import { UsersService } from "./users.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { createUserSchema } from "./schemas/createUser.schema";
import { ServiceResponse, TokenPayload } from "../types";
import { patchUserSchema } from "./schemas/patchUser.schema";


export class UsersController {

    static async getAll(req: AuthRequest, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pagesize as string) || 10;
            const users = await UsersService.getAll(page, pageSize);
            res.send(users);
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 500, message: 'Internal Server Error' });
        }
    }

    static async getOne(req: AuthRequest, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            if (isNaN(userId)) {
                return res.status(422).json({ error: 'Invalide ID' });
            }
            const user = await UsersService.getOne(+userId);
            res.send(user);
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 500, message: 'Internal Server Error' });
        }
    }

    static async create(req: AuthRequest, res: Response) {
        try {
            const { value: userData, error: validationError } = createUserSchema
                .prefs({
                    abortEarly: false,
                    errors: { label: 'key' }
                })
                .validate(req.body);

            if (validationError) {
                return res.status(422).send(validationError);
            }

            const user: ServiceResponse = await UsersService.create(userData);

            res.status(user.status).send(user);
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 500, message: 'Internal Server Error' });
        }
    }

    static async delete(req: AuthRequest, res: Response) {
        try {
            const userId = parseInt(req.params.id);

            if (isNaN(userId)) {
                return res.status(422).json({ error: 'Invalide ID' });
            }

            const deleted = await UsersService.delete(+userId);
            res.status(deleted.status).send(deleted);

        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 500, message: 'Internal Server Error' });
        }
    }

    static async patch(req: AuthRequest, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            if (isNaN(userId)) {
                return res.status(422).json({ error: 'Invalide ID' });
            }
            const { value: userData, error: validationError } = patchUserSchema
                .prefs({
                    abortEarly: false,
                    errors: { label: 'key' }
                })
                .validate(req.body);

            if (validationError) {
                return res.status(422).send(validationError);
            }

            if(!userData){
                return res.status(400).send({
                    status:400,
                    message:'No data to update'
                })
            }

            const user = req.user as TokenPayload;
            const deleted = await UsersService.patch(+userId, userData, user);

            res.send(deleted);
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 500, message: 'Internal Server Error' });
        }
    }

}