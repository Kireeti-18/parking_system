/*
  Warnings:

  - The `other_info` column on the `Token` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Token" DROP COLUMN "other_info",
ADD COLUMN     "other_info" JSONB NOT NULL DEFAULT '{}';
