import { Role } from "@prisma/client";
import Joi from "joi";

export const patchUserSchema = Joi.object({
    email: Joi.string()
        .email()
        .trim()
        .lowercase(),
    username: Joi.string()
        .min(2)
        .max(30)
        .trim()
        .lowercase(),
    role: Joi.string()
        .valid(...Object.values(Role))
})