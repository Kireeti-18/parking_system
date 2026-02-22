/*
  Warnings:

  - You are about to drop the column `price_per_hour` on the `parking_area` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."parking_area" DROP COLUMN "price_per_hour",
ADD COLUMN     "bike_price_per_hour" DECIMAL(10,2) NOT NULL DEFAULT 0.1,
ADD COLUMN     "car_price_per_hour" DECIMAL(10,2) NOT NULL DEFAULT 0.1;
