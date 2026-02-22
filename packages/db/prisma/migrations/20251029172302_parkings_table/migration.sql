-- CreateEnum
CREATE TYPE "public"."ParkingStatus" AS ENUM ('occupied', 'reserved', 'departed', 'maintenance');

-- AlterTable
ALTER TABLE "public"."parking_area" ADD COLUMN     "bike_fine_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "car_fine_price" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."parkings" (
    "id" TEXT NOT NULL,
    "parked_user_uuid" TEXT NOT NULL,
    "depature_user_uuid" TEXT NOT NULL,
    "parking_entry_admin_user" TEXT NOT NULL,
    "parking_depature_admin_user" TEXT NOT NULL,
    "parking_area_uuid" TEXT NOT NULL,
    "vehicle_number" TEXT NOT NULL,
    "vehicle_type" TEXT NOT NULL,
    "slot_number" TEXT NOT NULL,
    "status" "public"."ParkingStatus" NOT NULL,
    "fine" TEXT NOT NULL,
    "fined_slot" TEXT NOT NULL,
    "fined_time" TEXT NOT NULL,
    "entry_time_stamp" TEXT NOT NULL,
    "depature_time_stamp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parkings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."parkings" ADD CONSTRAINT "parkings_parked_user_uuid_fkey" FOREIGN KEY ("parked_user_uuid") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parkings" ADD CONSTRAINT "parkings_depature_user_uuid_fkey" FOREIGN KEY ("depature_user_uuid") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parkings" ADD CONSTRAINT "parkings_parking_area_uuid_fkey" FOREIGN KEY ("parking_area_uuid") REFERENCES "public"."parking_area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parkings" ADD CONSTRAINT "parkings_parking_entry_admin_user_parking_area_uuid_fkey" FOREIGN KEY ("parking_entry_admin_user", "parking_area_uuid") REFERENCES "public"."parking_area_admin"("user_id", "parking_area_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parkings" ADD CONSTRAINT "parkings_parking_depature_admin_user_parking_area_uuid_fkey" FOREIGN KEY ("parking_depature_admin_user", "parking_area_uuid") REFERENCES "public"."parking_area_admin"("user_id", "parking_area_id") ON DELETE RESTRICT ON UPDATE CASCADE;
