import swaggerJSDoc from 'swagger-jsdoc';
import config from './config';
import path from 'path';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Management API',
            version: '1.0.0',
            description: 'API для управления пользователями',
        },
        servers: [
            {
                url: `http://localhost:${config.PORT}/${config.API_PREFIX}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [path.join(__dirname, '../auth/docs/auth.docs.ts'),path.join(__dirname, '../users/docs/user.docs.ts')],
};

export const swaggerSpec = swaggerJSDoc(options);