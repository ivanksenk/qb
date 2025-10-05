import express from "express";
import config from "./config/config";
import "./config/interface/prisma.config";
import cors from 'cors';
import morgan from 'morgan'
import helmet from "helmet";
import { AppRouter } from "./app.router";
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./config/swagger.config";
import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 500, 
    message: {
      error: 'Слишком много запросов с этого IP, попробуйте позже'
    },
    standardHeaders: true, 
    legacyHeaders: false, 
  });

app.use(limiter);

app.use(`/${config.API_PREFIX}`, AppRouter);
app.use(`/${config.API_PREFIX}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(config.PORT, () => {
    console.log(`App listen at: http://localhost:${config.PORT}/${config.API_PREFIX}`);
    console.log(`API Documentation available at http://localhost:${config.PORT}/${config.API_PREFIX}/api-docs`);
})