import config from "../config/config";

export class DatabaseConfig {
    static getConnectionString(): string {
        const host = config.DB_HOST;
        const port = config.DB_PORT;
        const database = config.DB_NAME;
        const username = config.DB_USER;
        const password = config.DB_PASSWORD;

        const params = new URLSearchParams({
            connection_limit: '10',
            pool_timeout: '30',
            connect_timeout: '10'
        });

        return `postgresql://${username}:${password}@${host}:${port}/${database}?${params.toString()}`;
    }
}