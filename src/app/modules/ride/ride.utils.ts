import AppError from "../../errorHelpers/AppError";
import { ApprovalStatus, Available } from "../driver/driver.interface";
import { Driver } from "../driver/driver.model";
import { ILocation } from "./ride.interface";
import httpStatus from "http-status-codes";

export const haversineDistance = (
  loc1: { latitude: number; longitude: number },
  loc2: { latitude: number; longitude: number }
): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;

  const R = 6371; // radius of Earth in km
  const dLat = toRad(loc2.latitude - loc1.latitude);
  const dLon = toRad(loc2.longitude - loc1.longitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(loc1.latitude)) *
      Math.cos(toRad(loc2.latitude)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // distance in km
};

export const findNearestDriver = async (pickup: ILocation) => {
  // get online & free drivers
  const drivers = await Driver.find({
    available: Available.ONLINE,
    onRide: false,
    approvalStatus: ApprovalStatus.APPROVED,
  });

  console.log(drivers);

  if (!drivers.length) {
    throw new AppError(httpStatus.NOT_FOUND, "No drivers available");
  }

  // find nearest one
  let nearestDriver = drivers[0];
  let minDistance = haversineDistance(pickup, drivers[0].location);

  for (const driver of drivers) {
    const distance = haversineDistance(pickup, driver.location);
    if (distance < minDistance) {
      nearestDriver = driver;
      minDistance = distance;
    }
  }

  return { driver: nearestDriver, distance: minDistance };
};

export const calculateCost = (
  pickup: ILocation,
  destination: ILocation
): number => {
  const distance = haversineDistance(pickup, destination);
  const baseFare = 50; // in your currency
  const perKmRate = 15;

  return Math.ceil(baseFare + perKmRate * distance);
};
