-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(160) NOT NULL,
    "hashedPassword" VARCHAR(255) NOT NULL
);

-- CreateTable
CREATE TABLE "session" (
    "sid" VARCHAR(255) NOT NULL,
    "sess" JSONB NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "location" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "lat" DECIMAL(65,30) NOT NULL,
    "lng" DECIMAL(65,30) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensor" (
    "id" SERIAL NOT NULL,
    "sensorNumber" INTEGER NOT NULL,
    "spotName" VARCHAR(255) NOT NULL,
    "lat" DECIMAL(65,30) NOT NULL,
    "lng" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "locationId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiment" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL,
    "neuralNetworkLog" TEXT NOT NULL,
    "assimilationLog" TEXT NOT NULL,
    "rainGraph" VARCHAR(255) NOT NULL,
    "costGraph" VARCHAR(255) NOT NULL,
    "parameters" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "sensorId" INTEGER NOT NULL,
    "experimentId" INTEGER NOT NULL,

    PRIMARY KEY ("sensorId","experimentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "user.username_unique" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "sensor.sensorNumber_unique" ON "sensor"("sensorNumber");

-- AddForeignKey
ALTER TABLE "sensor" ADD FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiment" ADD FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status" ADD FOREIGN KEY ("sensorId") REFERENCES "sensor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status" ADD FOREIGN KEY ("experimentId") REFERENCES "experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
