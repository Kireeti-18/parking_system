/*
  Warnings:

  - You are about to drop the column `depature_user_uuid` on the `parkings` table. All the data in the column will be lost.
  - You are about to drop the column `parked_user_uuid` on the `parkings` table. All the data in the column will be lost.
  - You are about to drop the column `parking_area_uuid` on the `parkings` table. All the data in the column will be lost.
  - You are about to drop the column `parking_depature_admin_user` on the `parkings` table. All the data in the column will be lost.
  - You are about to drop the column `parking_entry_admin_user` on the `parkings` table. All the data in the column will be lost.
  - Added the required column `parked_user_id` to the `parkings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parking_area_id` to the `parkings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parking_entry_admin_id` to the `parkings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."parkings" DROP CONSTRAINT "parkings_depature_user_uuid_fkey";

-- DropForeignKey
ALTER TABLE "public"."parkings" DROP CONSTRAINT "parkings_parked_user_uuid_fkey";

-- DropForeignKey
ALTER TABLE "public"."parkings" DROP CONSTRAINT "parkings_parking_area_uuid_fkey";

-- DropForeignKey
ALTER TABLE "public"."parkings" DROP CONSTRAINT "parkings_parking_depature_admin_user_parking_area_uuid_fkey";

-- DropForeignKey
ALTER TABLE "public"."parkings" DROP CONSTRAINT "parkings_parking_entry_admin_user_parking_area_uuid_fkey";

-- AlterTable
ALTER TABLE "public"."parkings" DROP COLUMN "depature_user_uuid",
DROP COLUMN "parked_user_uuid",
DROP COLUMN "parking_area_uuid",
DROP COLUMN "parking_depature_admin_user",
DROP COLUMN "parking_entry_admin_user",
ADD COLUMN     "depature_user_id" TEXT,
ADD COLUMN     "parked_user_id" TEXT NOT NULL,
ADD COLUMN     "parking_area_id" TEXT NOT NULL,
ADD COLUMN     "parking_depature_admin_id" TEXT,
ADD COLUMN     "parking_entry_admin_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."parkings" ADD CONSTRAINT "parkings_parked_user_id_fkey" FOREIGN KEY ("parked_user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parkings" ADD CONSTRAINT "parkings_depature_user_id_fkey" FOREIGN KEY ("depature_user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parkings" ADD CONSTRAINT "parkings_parking_area_id_fkey" FOREIGN KEY ("parking_area_id") REFERENCES "public"."parking_area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parkings" ADD CONSTRAINT "parkings_parking_entry_admin_id_parking_area_id_fkey" FOREIGN KEY ("parking_entry_admin_id", "parking_area_id") REFERENCES "public"."parking_area_admin"("user_id", "parking_area_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parkings" ADD CONSTRAINT "parkings_parking_depature_admin_id_parking_area_id_fkey" FOREIGN KEY ("parking_depature_admin_id", "parking_area_id") REFERENCES "public"."parking_area_admin"("user_id", "parking_area_id") ON DELETE RESTRICT ON UPDATE CASCADE;
