/*
  Warnings:

  - You are about to drop the column `description` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the `ResultOnClass` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `isCorrect` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentId` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentId` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentId` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_classId_fkey";

-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_classId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_classId_fkey";

-- DropForeignKey
ALTER TABLE "ResultOnClass" DROP CONSTRAINT "ResultOnClass_userId_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "isCorrect" BOOLEAN NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "classId",
ADD COLUMN     "contentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "classId",
ADD COLUMN     "contentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "classId",
ADD COLUMN     "contentId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ResultOnClass";

-- CreateTable
CREATE TABLE "Attempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttemptAnswer" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,
    "selected" BOOLEAN NOT NULL,

    CONSTRAINT "AttemptAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptAnswer" ADD CONSTRAINT "AttemptAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "Attempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptAnswer" ADD CONSTRAINT "AttemptAnswer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
