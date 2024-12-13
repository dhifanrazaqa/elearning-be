/*
  Warnings:

  - You are about to drop the column `ForumId` on the `ForumReply` table. All the data in the column will be lost.
  - You are about to drop the `Forum` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `forumId` to the `ForumReply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ForumReply` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Forum" DROP CONSTRAINT "Forum_classId_fkey";

-- DropForeignKey
ALTER TABLE "ForumReply" DROP CONSTRAINT "ForumReply_ForumId_fkey";

-- AlterTable
ALTER TABLE "ForumReply" DROP COLUMN "ForumId",
ADD COLUMN     "forumId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Forum";

-- CreateTable
CREATE TABLE "ForumPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "classId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ForumPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumReply" ADD CONSTRAINT "ForumReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumReply" ADD CONSTRAINT "ForumReply_forumId_fkey" FOREIGN KEY ("forumId") REFERENCES "ForumPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
