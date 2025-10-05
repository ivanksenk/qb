import { DatabaseConfig } from "../src/utils/database";
import { execSync } from "child_process";


process.env.DATABASE_URL = DatabaseConfig.getConnectionString();

console.log(process.env.DATABASE_URL);

const command = process.argv.slice(2).join(' ');

if (command) {
    execSync(command, { stdio: 'inherit' });
}