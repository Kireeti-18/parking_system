/*
  Warnings:

  - Changed the type of `user_type` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pricing_type` on the `parking_area` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."PricingType" AS ENUM ('1h', '2h', '6h', '12h', '1d', '2d', '1w');

-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('user', 'admin', 'sub_admin', 'security');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "user_type",
ADD COLUMN     "user_type" "public"."UserType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."parking_area" DROP COLUMN "pricing_type",
ADD COLUMN     "pricing_type" "public"."PricingType" NOT NULL;
