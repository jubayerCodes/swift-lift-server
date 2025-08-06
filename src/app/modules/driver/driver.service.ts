import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { IDriver } from "./driver.interface";
import { Driver } from "./driver.model";
import httpStatus from "http-status-codes";
import { Role } from "../user/user.interface";

const driverRequest = async (payload: Partial<IDriver>) => {
  const { userId } = payload;

  const existingDriver = await Driver.findOne({ userId });

  if (existingDriver) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver Already Exist");
  }

  const driverReq = await Driver.create(payload);

  return driverReq;
};

const updateDriver = async (
  driverId: string,
  payload: Partial<IDriver>,
  decodedToken: JwtPayload
) => {
  const existingDriver = await Driver.findById(driverId);

  if (!existingDriver) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver Not Exist");
  }

  if (payload.available && decodedToken.role !== Role.DRIVER) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (payload.vehicleInfo && decodedToken.role !== Role.DRIVER) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (
    payload.approvalStatus &&
    (decodedToken.role !== Role.ADMIN || decodedToken.role !== Role.SUPER_ADMIN)
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  const newUpdatedDriver = await Driver.findByIdAndUpdate(driverId, payload, {
    new: true,
  });

  return newUpdatedDriver;
};

export const DriverServices = {
  driverRequest,
  updateDriver,
};
