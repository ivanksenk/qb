import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DatabaseConfig } from '../src/utils/database';

process.env.DATABASE_URL = DatabaseConfig.getConnectionString();
const prisma = new PrismaClient();

async function main() {
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();


  const adminEmail = 'admin@example.com';
  const adminPassword = 'Zxdfrt23.';

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  
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

  const managerHashedPassword = await bcrypt.hash(managerPassword, 12);
  
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