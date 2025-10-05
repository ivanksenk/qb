"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../src/utils/database");
process.env.DATABASE_URL = database_1.DatabaseConfig.getConnectionString();
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    const adminEmail = 'admin@example.com';
    const adminPassword = 'Zxdfrt23.';
    const hashedPassword = await bcryptjs_1.default.hash(adminPassword, 12);
    await prisma.user.create({
        data: {
            username: 'Administrator',
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN'
        }
    });
    const managerEmail = 'manager@example.com';
    const managerPassword = '24Agereg!';
    const managerHashedPassword = await bcryptjs_1.default.hash(managerPassword, 12);
    await prisma.user.create({
        data: {
            username: 'Test Manager',
            email: managerEmail,
            password: managerHashedPassword,
            role: 'MANAGER'
        }
    });
    console.log('Seed data created:');
    console.log('Admin user:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('\nManager user:');
    console.log(`Email: ${managerEmail}`);
    console.log(`Password: ${managerPassword}`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
