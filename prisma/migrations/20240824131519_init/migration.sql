-- AlterTable
ALTER TABLE "kolam_booking" ALTER COLUMN "tarikh" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "kolam_booking_add_ons" ADD COLUMN     "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
