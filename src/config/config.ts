import Joi from 'joi';
import * as dotenv from 'dotenv';
import { ConfigInterface } from './interface/config.interface';

dotenv.config();

const envSchema = Joi.object({
    DB_HOST: Joi.string().required().min(1).default('localhost'),
    DB_USER: Joi.string().required().min(1).default('root'),
    DB_PASSWORD: Joi.string().required().min(3),
    DB_NAME: Joi.string().required().min(3),
    DB_PORT: Joi.number().required().min(1000),
    JWT_ACCESS_SECRET: Joi.string().required().min(3),
    JWT_REFRESH_SECRET: Joi.string().required().min(3),
    PORT: Joi.number().required().min(1000),
    API_PREFIX: Joi.string().required().min(3),
    DEFAULT_USER_PASSWORD: Joi.string().required().min(8)
}).unknown(true);


const { value: config, error } = envSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);
if (error) {
    throw new Error(`Config validation error:${error.message}`);
}

export default config as ConfigInterface