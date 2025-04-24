-- Create tables

-- Role table
CREATE TABLE "Role" (
  "role_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL CHECK ("name" IN ('ADMIN', 'USER')),
  PRIMARY KEY ("role_id")
);

-- User table
CREATE TABLE "User" (
  "user_id" SERIAL NOT NULL,
  "username" VARCHAR(50) NOT NULL,
  "email" VARCHAR(100) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "role_id" INTEGER NOT NULL DEFAULT 2,
  "full_name" VARCHAR(50) NOT NULL,
  "phone" VARCHAR(20),
  "failed_attempts" INTEGER NOT NULL DEFAULT 0,
  "is_blocked" BOOLEAN NOT NULL DEFAULT false,
  "blocked_until" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  PRIMARY KEY ("user_id"),
  CONSTRAINT "User_username_key" UNIQUE ("username"),
  CONSTRAINT "User_email_key" UNIQUE ("email"),
  CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("role_id")
);

-- Contact table
CREATE TABLE "Contact" (
  "contact_id" SERIAL NOT NULL,
  "full_name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(100) NOT NULL,
  "phone" VARCHAR(20),
  "title" VARCHAR(100),
  "message" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("contact_id"),
  CONSTRAINT "Contact_email_key" UNIQUE ("email")
);

-- Project table
CREATE TABLE "Project" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "githubUrl" TEXT NOT NULL,
  "liveUrl" TEXT,
  "imageUrl" TEXT,
  "technologies" TEXT,
  "userId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE CASCADE
);

-- Post table
CREATE TABLE "Post" (
  "id" SERIAL NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) NOT NULL,
  "content" TEXT NOT NULL,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "authorId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "Post_slug_key" UNIQUE ("slug"),
  CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("user_id") ON DELETE CASCADE
);

-- Comment table
CREATE TABLE "Comment" (
  "id" SERIAL NOT NULL,
  "content" TEXT NOT NULL,
  "authorId" INTEGER NOT NULL,
  "postId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("user_id") ON DELETE CASCADE,
  CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id")
);

-- Insert default roles
INSERT INTO "Role" ("role_id", "name") VALUES (1, 'ADMIN');
INSERT INTO "Role" ("role_id", "name") VALUES (2, 'USER'); 