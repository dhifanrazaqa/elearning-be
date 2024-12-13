/*
  Warnings:

  - Added the required column `status` to the `ClassOnUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClassOnUser" ADD COLUMN     "status" TEXT NOT NULL;
