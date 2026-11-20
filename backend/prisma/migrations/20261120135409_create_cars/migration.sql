-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('available', 'rented', 'maintenance');

-- CreateTable
CREATE TABLE "car_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "car_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,

    CONSTRAINT "car_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cars" (
    "id" TEXT NOT NULL,
    "license_plate" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "price_per_day" INTEGER NOT NULL,
    "status" "CarStatus" NOT NULL DEFAULT 'available',
    "rental_date" TIMESTAMP(3),
    "due_date" TIMESTAMP(3),
    "type_id" TEXT NOT NULL,
    "car_model_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "car_types_name_key" ON "car_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "car_models_brand_id_name_key" ON "car_models"("brand_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "cars_license_plate_key" ON "cars"("license_plate");
