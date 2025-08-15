import AppError from "../../errorHelpers/AppError";
import { Driver } from "../driver/driver.model";
import { IRide, IRideStatus } from "./ride.interface";
import httpStatus from "http-status-codes";
import { Ride } from "./ride.model";

const requestRide = async (payload: IRide) => {
  const { driverId } = payload;

  const previousRide = await Ride.findOne({ riderId: payload?.riderId });

  const driver = await Driver.findById(driverId);

  const driverOnRide = driver?.onRide;

  if (driverOnRide) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver Already on a Ride");
  }

  if (previousRide) {
    if (
      ![IRideStatus.COMPLETED, IRideStatus.CANCELLED].includes(
        previousRide?.status as IRideStatus
      )
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, "Rider Already on a Ride");
    }
  }

  const requestedRide = await Ride.create(payload);

  return requestedRide;
};

const cancelRide = async (rideId: string) => {
  const existingRide = await Ride.findById(rideId);

  if (!existingRide) {
    throw new AppError(httpStatus.BAD_REQUEST, "Ride Not Exist");
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

  return updatedRide;
};

export const RideServices = {
  requestRide,
  cancelRide,
};
