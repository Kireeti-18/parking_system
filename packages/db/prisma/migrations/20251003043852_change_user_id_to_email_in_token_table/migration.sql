/*
  Warnings:

  - You are about to drop the column `user_id` on the `Token` table. All the data in the column will be lost.
  - Added the required column `email` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_type` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Token" DROP CONSTRAINT "Token_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."Token" DROP COLUMN "user_id",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "user_type" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Token" ADD CONSTRAINT "Token_email_fkey" FOREIGN KEY ("email") REFERENCES "public"."User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
