/*
  Warnings:

  - You are about to drop the column `area_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `area` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `city` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `country` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `district` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `province` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `area` DROP FOREIGN KEY `Area_city_id_fkey`;

-- DropForeignKey
ALTER TABLE `city` DROP FOREIGN KEY `City_district_id_fkey`;

-- DropForeignKey
ALTER TABLE `district` DROP FOREIGN KEY `District_province_id_fkey`;

-- DropForeignKey
ALTER TABLE `province` DROP FOREIGN KEY `Province_country_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_area_id_fkey`;

-- DropIndex
DROP INDEX `User_area_id_fkey` ON `user`;

-- AlterTable
ALTER TABLE `contact` ADD COLUMN `phone` VARCHAR(20) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `area_id`;

-- DropTable
DROP TABLE `area`;

-- DropTable
DROP TABLE `city`;

-- DropTable
DROP TABLE `country`;

-- DropTable
DROP TABLE `district`;

-- DropTable
DROP TABLE `province`;
