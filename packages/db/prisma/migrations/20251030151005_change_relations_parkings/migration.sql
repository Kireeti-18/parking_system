-- DropForeignKey
ALTER TABLE "public"."parkings" DROP CONSTRAINT "parkings_depature_user_uuid_fkey";

-- AlterTable
ALTER TABLE "public"."parkings" ADD COLUMN     "fine_desc" TEXT,
ALTER COLUMN "depature_user_uuid" DROP NOT NULL,
ALTER COLUMN "parking_depature_admin_user" DROP NOT NULL,
ALTER COLUMN "fine" DROP NOT NULL,
ALTER COLUMN "fined_slot" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."parkings" ADD CONSTRAINT "parkings_depature_user_uuid_fkey" FOREIGN KEY ("depature_user_uuid") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
