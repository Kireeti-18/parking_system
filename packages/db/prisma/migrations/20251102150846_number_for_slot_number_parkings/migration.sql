/*
  Warnings:

  - Changed the type of `slot_number` on the `parkings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."parkings" DROP COLUMN "slot_number",
ADD COLUMN     "slot_number" INTEGER NOT NULL;
