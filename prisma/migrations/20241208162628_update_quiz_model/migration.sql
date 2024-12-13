/*
  Warnings:

  - You are about to drop the column `selected` on the `AttemptAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Question` table. All the data in the column will be lost.
  - Added the required column `text` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attempt" ALTER COLUMN "score" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AttemptAnswer" DROP COLUMN "selected";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "text" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "teacherId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
