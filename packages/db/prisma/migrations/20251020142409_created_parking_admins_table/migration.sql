/*
  Warnings:

  - You are about to drop the `ParkingArea` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."ParkingArea";

-- CreateTable
CREATE TABLE "public"."parking_area" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parking_location" JSONB NOT NULL DEFAULT '{}',
    "bike_slots" INTEGER NOT NULL,
    "car_slots" INTEGER NOT NULL,
    "is_opened" BOOLEAN NOT NULL,
    "pricing_type" TEXT NOT NULL,
    "price_per_hour" DOUBLE PRECISION NOT NULL,
    "verification_status" BOOLEAN NOT NULL,
    "meta_data" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parking_area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."parking_area_admin" (
    "user_id" TEXT NOT NULL,
    "parking_area_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parking_area_admin_pkey" PRIMARY KEY ("user_id","parking_area_id")
);

-- AddForeignKey
ALTER TABLE "public"."parking_area_admin" ADD CONSTRAINT "parking_area_admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parking_area_admin" ADD CONSTRAINT "parking_area_admin_parking_area_id_fkey" FOREIGN KEY ("parking_area_id") REFERENCES "public"."parking_area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
