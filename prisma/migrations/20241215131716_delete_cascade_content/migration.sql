-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_classId_fkey";

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
