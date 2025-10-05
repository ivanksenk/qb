import Joi from "joi";

export const changePasswordSchema = Joi.object({
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
        ,
    newPassword: Joi.string()
        .min(8)
        .max(30)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*./])'))
        .required()
        .messages({
            'string.pattern.base': 'Новый пароль должен содержать минимум одну строчную букву, одну заглавную букву, одну цифру и один специальный символ',
            'string.empty': 'Новый пароль не может быть пустым',
            'string.min': 'Новый пароль должен содержать минимум {#limit} символов',
            'string.max': 'Новый пароль должен содержать максимум {#limit} символов',
            'any.required': 'Новый пароль обязателен для заполнения'
        })
})
.required()
.messages({
    'any.required': 'Поля email, пароль и новый пароль обязательны для заполнения'
})