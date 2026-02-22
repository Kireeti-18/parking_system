/*
  Warnings:

  - Changed the type of `user_type` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pricing_type` on the `parking_area` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `parkings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vehicle_type` on the `parkings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "user_type",
ADD COLUMN     "user_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."parking_area" DROP COLUMN "pricing_type",
ADD COLUMN     "pricing_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."parkings" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
DROP COLUMN "vehicle_type",
ADD COLUMN     "vehicle_type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."ParkingStatus";

-- DropEnum
DROP TYPE "public"."PricingType";

-- DropEnum
DROP TYPE "public"."UserType";

-- DropEnum
DROP TYPE "public"."VehicleType";
