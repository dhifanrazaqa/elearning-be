-- AlterTable
ALTER TABLE "Assignment" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "fileUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "grade" DOUBLE PRECISION,
ADD COLUMN     "text" TEXT;
