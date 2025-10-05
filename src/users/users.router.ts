import { Router } from "express";
import { UsersController } from "./users.controller";
import { checkAuth, checkRole } from "../middleware/auth.middleware";

export const UsersRouter = Router();


UsersRouter.get('/', checkAuth, checkRole(['ADMIN']), UsersController.getAll);
UsersRouter.get('/:id', checkAuth, checkRole(['ADMIN']), UsersController.getOne);
UsersRouter.post('/', checkAuth, checkRole(['ADMIN']), UsersController.create);
UsersRouter.delete('/:id', checkAuth, checkRole(['ADMIN']), UsersController.delete);
UsersRouter.patch('/:id', checkAuth, UsersController.patch);