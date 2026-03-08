-- CreateTable
CREATE TABLE "public"."settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nearest_count" INTEGER NOT NULL DEFAULT 5,
    "nearest_distance" INTEGER NOT NULL DEFAULT 100,
    "notifications" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "settings_user_id_key" ON "public"."settings"("user_id");

-- AddForeignKey
ALTER TABLE "public"."settings" ADD CONSTRAINT "settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
