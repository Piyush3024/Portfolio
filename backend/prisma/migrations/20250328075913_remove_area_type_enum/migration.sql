/*
  Warnings:

  - You are about to alter the column `type` on the `area` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(50)`.
  - You are about to alter the column `name` on the `role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Enum(EnumId(0))`.
  - You are about to drop the column `verification_token` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `area` MODIFY `type` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `role` MODIFY `name` ENUM('ADMIN', 'USER') NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `verification_token`;
