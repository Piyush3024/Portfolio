import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Upsert roles to avoid unique constraint errors
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { role_id: 1 },
      update: { name: 'ADMIN' },
      create: {
        role_id: 1,
        name: 'ADMIN',
      },
    }),
    prisma.role.upsert({
      where: { role_id: 2 },
      update: { name: 'USER' },
      create: {
        role_id: 2,
        name: 'USER',
      },
    }),
  ]);

  // Hash password for admin user
  const hashedPassword = await bcrypt.hash('piyush@3024', 10);

  // Create admin user with new fields
  const adminUser = await prisma.user.create({
    data: {
      username: 'piyush',
      email: 'piyushbhul3024@gmail.com',
      password: hashedPassword,
      role_id: 1,
      full_name: 'Piyush Bhul',
      phone: '9769830588',
      oauth_provider: null,
      oauth_id: null,
      reset_token: null,
      reset_token_expiry: null,
    },
  });

  // Create a test project
  const project = await prisma.project.create({
    data: {
      name: 'Sample Project',
      description: 'This is a sample project created during database seeding.',
      githubUrl: 'https://github.com/example/sample-project',
      liveUrl: 'https://example.com/sample-project',
      imageUrl: 'https://via.placeholder.com/300',
      technologies: 'Node.js, React, Prisma, PostgreSQL',
      userId: adminUser.user_id,
    },
  });

  // Create a test blog post
  const post = await prisma.post.create({
    data: {
      title: 'Getting Started with Prisma',
      slug: 'getting-started-with-prisma',
      content: 'This is a sample blog post about getting started with Prisma ORM.',
      published: true,
      authorId: adminUser.user_id,
    },
  });

  // Create a test comment
  const comment = await prisma.comment.create({
    data: {
      content: 'This is a sample comment on the blog post.',
      authorId: adminUser.user_id,
      postId: post.id,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });