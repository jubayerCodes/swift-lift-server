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

const updateApproval = async (
  userId: string,
  payload: Pick<IDriver, "approvalStatus">
) => {
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Exist");
  }

  if (payload?.approvalStatus === ApprovalStatus.APPROVED) {
    await User.findByIdAndUpdate(userId, {
      role: Role.DRIVER,
    });
  }

  const existingDriver = await Driver.findOne({ userId });

  if (!existingDriver) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver Not Exist");
  }

  await Driver.updateOne(
    { userId },
    { $set: { approvalStatus: payload?.approvalStatus } }
  );

  return true;
};

const updateAvailability = async (
  driverId: string,
  payload: Pick<IDriver, "available">,
  user: JwtPayload
) => {
  const existingDriver = await Driver.findById(driverId);

  if (
    user?.role === Role.DRIVER &&
    user?.userId !== existingDriver?.userId?.toString()
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Your Are Not Permitted To View This"
    );
  }
  if (!existingDriver) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver Not Exist");
  }

  await Driver.findByIdAndUpdate(driverId, { available: payload.available });

  return true;
};

const getAllDrivers = async () => {
  const allDrivers = await Driver.find();

  return allDrivers;
};

export const DriverServices = {
  driverRequest,
  updateDriver,
  updateApproval,
  updateAvailability,
  getAllDrivers,
};
