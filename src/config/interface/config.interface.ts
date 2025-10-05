export interface ConfigInterface {
    DB_HOST: string,
    DB_USER: string,
    DB_PASSWORD: string,
    DB_NAME: string,
    DB_PORT: number,
    JWT_ACCESS_SECRET: string,
    JWT_REFRESH_SECRET: string,
    PORT: number,
    API_PREFIX:string,
    DEFAULT_USER_PASSWORD:string,
}