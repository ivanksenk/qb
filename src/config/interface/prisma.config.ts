import { DatabaseConfig } from "../../utils/database";

process.env.DATABASE_URL = DatabaseConfig.getConnectionString();

export default process.env.DATABASE_URL;