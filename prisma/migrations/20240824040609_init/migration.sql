-- CreateEnum
CREATE TYPE "Payment_Status" AS ENUM ('CREATED', 'PENDING', 'CANCELLED', 'PAID');

-- CreateEnum
CREATE TYPE "Add_Ons" AS ENUM ('CACING', 'MINYAK');

-- CreateTable
CREATE TABLE "kolam" (
    "id" SERIAL NOT NULL,
    "label" INTEGER NOT NULL,
    "jumlah_pancang" INTEGER NOT NULL,

    CONSTRAINT "kolam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarikh_memancing" (
    "id" SERIAL NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "tarikh" TIMESTAMPTZ(6) NOT NULL,
    "created_on" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tarikh_memancing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "nama_pertama" TEXT NOT NULL,
    "nama_akhir" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verification_token" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kolam_booking" (
    "id" SERIAL NOT NULL,
    "kolam_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "payment_status" "Payment_Status" NOT NULL DEFAULT 'CREATED',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "tarikh" TIMESTAMPTZ(6) NOT NULL,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kolam_booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kolam_booking_pancang" (
    "id" SERIAL NOT NULL,
    "nombor" INTEGER NOT NULL,
    "kolam_booking_id" INTEGER NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kolam_booking_pancang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kolam_booking_add_ons" (
    "id" SERIAL NOT NULL,
    "type" "Add_Ons" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "kolam_booking_id" INTEGER NOT NULL,

    CONSTRAINT "kolam_booking_add_ons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_username_key" ON "user"("email", "username");

-- AddForeignKey
ALTER TABLE "kolam_booking" ADD CONSTRAINT "kolam_booking_kolam_id_fkey" FOREIGN KEY ("kolam_id") REFERENCES "kolam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kolam_booking" ADD CONSTRAINT "kolam_booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kolam_booking_pancang" ADD CONSTRAINT "kolam_booking_pancang_kolam_booking_id_fkey" FOREIGN KEY ("kolam_booking_id") REFERENCES "kolam_booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kolam_booking_add_ons" ADD CONSTRAINT "kolam_booking_add_ons_kolam_booking_id_fkey" FOREIGN KEY ("kolam_booking_id") REFERENCES "kolam_booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
