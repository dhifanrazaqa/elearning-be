/*
  Warnings:

  - Added the required column `description` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "fileUrl" TEXT NOT NULL;
