-- Create tables

-- Role table
CREATE TABLE `Role` (
  `role_id` INT NOT NULL,
  `name` ENUM('ADMIN', 'USER') NOT NULL,
  PRIMARY KEY (`role_id`)
);

-- User table
CREATE TABLE `User` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role_id` INT NOT NULL DEFAULT 2,
  `full_name` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(20),
  `failed_attempts` INT NOT NULL DEFAULT 0,
  `is_blocked` BOOLEAN NOT NULL DEFAULT false,
  `blocked_until` DATETIME(3),
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `User_username_key`(`username`),
  UNIQUE INDEX `User_email_key`(`email`),
  FOREIGN KEY (`role_id`) REFERENCES `Role`(`role_id`)
);

-- Contact table
CREATE TABLE `Contact` (
  `contact_id` INT NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20),
  `title` VARCHAR(100),
  `message` TEXT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`contact_id`),
  UNIQUE INDEX `Contact_email_key`(`email`)
);

-- Project table
CREATE TABLE `Project` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `githubUrl` VARCHAR(191) NOT NULL,
  `liveUrl` VARCHAR(191),
  `imageUrl` TEXT,
  `technologies` TEXT,
  `userId` INT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE CASCADE
);

-- Post table
CREATE TABLE `Post` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `published` BOOLEAN NOT NULL DEFAULT false,
  `authorId` INT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Post_slug_key`(`slug`),
  FOREIGN KEY (`authorId`) REFERENCES `User`(`user_id`) ON DELETE CASCADE
);

-- Comment table
CREATE TABLE `Comment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` TEXT NOT NULL,
  `authorId` INT NOT NULL,
  `postId` INT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`authorId`) REFERENCES `User`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`postId`) REFERENCES `Post`(`id`)
);

-- Insert default roles
INSERT INTO `Role` (`role_id`, `name`) VALUES (1, 'ADMIN');
INSERT INTO `Role` (`role_id`, `name`) VALUES (2, 'USER'); 