-- CreateTable
CREATE TABLE "public"."ParkingArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parking_location" JSONB NOT NULL,
    "bike_slots" INTEGER NOT NULL,
    "car_slots" INTEGER NOT NULL,
    "is_opened" BOOLEAN NOT NULL,
    "pricing_type" TEXT NOT NULL,
    "price_per_hour" DOUBLE PRECISION NOT NULL,
    "verification_status" BOOLEAN NOT NULL,
    "meta_data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParkingArea_pkey" PRIMARY KEY ("id")
);
