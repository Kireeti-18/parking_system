/*
  Warnings:

  - Added the required column `user_type` to the `parking_area_admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."parking_area_admin" ADD COLUMN     "user_type" TEXT NOT NULL;
