/*
  Warnings:

  - Changed the type of `vehicle_type` on the `parkings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."VehicleType" AS ENUM ('bike', 'car');

-- AlterTable
ALTER TABLE "public"."parkings" DROP COLUMN "vehicle_type",
ADD COLUMN     "vehicle_type" "public"."VehicleType" NOT NULL;
