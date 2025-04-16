/*
  Warnings:

  - You are about to drop the column `updated_at` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the column `email_verified` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `contact` DROP COLUMN `updated_at`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `email_verified`;
