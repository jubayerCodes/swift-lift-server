import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { ApprovalStatus, IDriver } from "./driver.interface";
import { Driver } from "./driver.model";
import httpStatus from "http-status-codes";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";

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
    decodedToken.role !== Role.ADMIN &&
    decodedToken.role !== Role.SUPER_ADMIN
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  const newUpdatedDriver = await Driver.findByIdAndUpdate(driverId, payload, {
    new: true,
  });

  return newUpdatedDriver;
};

const approveDriver = async (userId: string) => {
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Exist");
  }

  await User.findByIdAndUpdate(userId, {
    role: Role.DRIVER,
  });

  const existingDriver = await Driver.findOne({ userId });

  if (!existingDriver) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver Not Exist");
  }

  await Driver.updateOne(
    { userId },
    { $set: { approvalStatus: ApprovalStatus.APPROVED } }
  );

  return true;
};

export const DriverServices = {
  driverRequest,
  updateDriver,
  approveDriver,
};
