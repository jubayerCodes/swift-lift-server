import AppError from "../../errorHelpers/AppError";
import { IRide, IRideStatus } from "./ride.interface";
import httpStatus from "http-status-codes";
import { Ride } from "./ride.model";
import { calculateCost, findNearestDriver } from "./ride.utils";
import { Driver } from "../driver/driver.model";
import { JwtPayload } from "jsonwebtoken";

const requestRide = async (
  payload: Omit<IRide, "driverId" | "cost" | "status">,
  decodedToken: JwtPayload
) => {
  if (payload.riderId.toString() !== decodedToken.userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "UNAUTHORIZED");
  }

  const previousRide = await Ride.findOne({ riderId: payload.riderId }).sort({
    createdAt: -1,
  });

  if (
    previousRide &&
    ![IRideStatus.COMPLETED, IRideStatus.CANCELLED].includes(
      previousRide.status
    )
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Rider already on a ride");
  }

  const { driver } = await findNearestDriver(payload.pickup);

  const cost = calculateCost(payload.pickup, payload.destination);

  const requestedRide = await Ride.create({
    ...payload,
    driverId: driver?.userId,
    cost,
    status: IRideStatus.REQUESTED,
  });

  driver.onRide = true;
  await driver.save();

  return requestedRide;
};

const cancelRide = async (rideId: string, decodedToken: JwtPayload) => {
  const existingRide = await Ride.findById(rideId);

  if (!existingRide) {
    throw new AppError(httpStatus.BAD_REQUEST, "Ride Not Exist");
  }

  if (existingRide.driverId.toString() !== decodedToken.userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Your Are Not Permitted To Cancel"
    );
  }

  if ([IRideStatus.CANCELLED].includes(existingRide.status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Ride Already Cancelled");
  }

  if (![IRideStatus.REQUESTED].includes(existingRide.status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Ride Cannot Be Cancelled Now");
  }

  const updatedRide = await Ride.findByIdAndUpdate(
    rideId,
    { status: IRideStatus.CANCELLED },
    { new: true }
  );

  await Driver.findByIdAndUpdate(existingRide.driverId, { onRide: false });

  return updatedRide;
};

const acceptRide = async (
  rideId: string,
  payload: {
    status: IRideStatus.ACCEPTED | IRideStatus.CANCELLED;
  },
  decodedToken: JwtPayload
) => {
  const existingRide = await Ride.findById(rideId);

  if (!existingRide) {
    throw new AppError(httpStatus.BAD_REQUEST, "Ride Not Exist");
  }
  if (existingRide.driverId.toString() !== decodedToken.userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Your Are Not Permitted To Accept"
    );
  }

  if (existingRide.status !== IRideStatus.REQUESTED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Ride Cannot Be ${payload.status} Now`
    );
  }

  const updatedRide = await Ride.findByIdAndUpdate(
    rideId,
    { status: payload.status },
    { new: true }
  );

  return updatedRide;
};

const updateRideStatus = async (
  rideId: string,
  payload: {
    status: IRideStatus;
  },
  decodedToken: JwtPayload
) => {
  const existingRide = await Ride.findById(rideId);

  if (!existingRide) {
    throw new AppError(httpStatus.BAD_REQUEST, "Ride Not Exist");
  }
  if (existingRide.driverId.toString() !== decodedToken.userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Your Are Not Permitted To Update Status"
    );
  }

  if (
    existingRide.status === IRideStatus.COMPLETED ||
    existingRide.status === IRideStatus.CANCELLED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Ride Status Cannot Be Updated Now`
    );
  }

  const updatedRide = await Ride.findByIdAndUpdate(
    rideId,
    { status: payload.status },
    { new: true }
  );

  return updatedRide;
};

const getAllRides = async () => {
  const allRides = await Ride.find();

  return allRides;
};

export const RideServices = {
  requestRide,
  cancelRide,
  acceptRide,
  updateRideStatus,
  getAllRides,
};
