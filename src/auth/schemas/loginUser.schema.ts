import Joi from "joi";

export const loginUserSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .trim()
        .lowercase()
        .messages({
            'string.email': 'Пожалуйста, введите корректный email адрес',
            'string.empty': 'Email не может быть пустым',
            'any.required': 'Email является обязательным полем'
        }),
    password: Joi.string()
        .min(8)
        .max(30)
        .required()
        .messages({
            'string.pattern.base': 'Пароль должен содержать минимум одну строчную букву, одну заглавную букву, одну цифру и один специальный символ',
            'string.empty': 'Пароль не может быть пустым',
            'string.min': 'Пароль должен содержать минимум {#limit} символов',
            'string.max': 'Пароль должен содержать максимум {#limit} символов',
            'any.required': 'Пароль обязателен для заполнения'
        })
})
    .required()
    .messages({
        'any.required': 'Поля email и пароль обязательны для заполнения'
    })