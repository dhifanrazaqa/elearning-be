/*
  Warnings:

  - You are about to drop the column `description` on the `ForumPost` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `ForumPost` table. All the data in the column will be lost.
  - Added the required column `text` to the `ForumPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ForumPost" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "text" TEXT NOT NULL;
