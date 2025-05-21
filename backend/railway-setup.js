import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database migration...');

  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful');

    // Check if setup is already done
    let roleExists = false;
    try {
      const roles = await prisma.role.findMany();
      roleExists = roles.length > 0;
    } catch (error) {
      console.log('Role table not found, will create schema');
    }

    if (!roleExists) {
      console.log('Setting up initial schema...');
      
      // Create roles
      await prisma.role.create({
        data: {
          role_id: 1,
          name: 'ADMIN'
        }
      });
      
      await prisma.role.create({
        data: {
          role_id: 2,
          name: 'USER'
        }
      });
      
      console.log('Created roles');
      
      // Create admin user
      await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@example.com',
          password: '$2b$10$zJnUPB6xHOnZZz6sFQwGgeqlfgIODt3s9QhJPvIbj0uCUAqU5qp.6', // password: 'admin123'
          role_id: 1,
          full_name: 'Admin User',
          updated_at: new Date()
        }
      });
      
      console.log('Created admin user');
    } else {
      console.log('Schema already initialized, skipping setup');
    }

    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration script if SETUP_DB is set to true
if (process.env.SETUP_DB === 'true') {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else {
  console.log('Skipping database setup (SETUP_DB not set to true)');
} 