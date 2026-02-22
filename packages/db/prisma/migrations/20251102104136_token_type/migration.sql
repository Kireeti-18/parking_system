/*
  Warnings:

  - You are about to drop the column `user_type` on the `Token` table. All the data in the column will be lost.
  - Added the required column `token_type` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Token" DROP COLUMN "user_type",
ADD COLUMN     "token_type" TEXT NOT NULL;
