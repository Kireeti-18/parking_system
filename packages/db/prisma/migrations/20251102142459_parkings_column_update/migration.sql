/*
  Warnings:

  - The `entry_time_stamp` column on the `parkings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `depature_time_stamp` on the `parkings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."parkings" ALTER COLUMN "fined_time" DROP NOT NULL,
DROP COLUMN "entry_time_stamp",
ADD COLUMN     "entry_time_stamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "depature_time_stamp",
ADD COLUMN     "depature_time_stamp" TIMESTAMP(3) NOT NULL;
