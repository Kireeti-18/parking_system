-- AlterTable
ALTER TABLE "public"."parkings" ADD COLUMN     "other_info" JSONB NOT NULL DEFAULT '{}';
